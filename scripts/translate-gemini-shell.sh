#!/bin/bash

# Gemini CLI Translation Script
# This script translates Chinese markdown files to English using local Gemini CLI

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
MAX_RETRIES=3

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to check if gemini CLI is available
check_gemini() {
    if ! command -v gemini &> /dev/null; then
        print_error "Gemini CLI is not installed or not in PATH"
        echo ""
        echo "Please install Gemini CLI:"
        echo "  npm install -g @google/gemini-cli"
        echo ""
        echo "Or use npx:"
        echo "  npx @google/gemini-cli"
        exit 1
    fi
    
    print_success "Gemini CLI found: $(gemini --version)"
}

# Function to check if translation result is empty or invalid
is_translation_empty() {
    local text="$1"
    
    # Remove whitespace and check if empty
    local trimmed=$(echo "$text" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
    
    # Check if empty or only contains whitespace
    if [[ -z "$trimmed" ]]; then
        return 0  # Empty
    fi
    
    # Check if it's extremely short (likely an error) - but be more lenient
    if [[ ${#trimmed} -lt 2 ]]; then
        return 0  # Too short, likely empty/invalid
    fi
    
    return 1  # Not empty
}

# Function to translate text using Gemini CLI with retry
translate_text_with_retry() {
    local text="$1"
    local max_retries="${2:-$MAX_RETRIES}"
    local retry_count=0
    
    while [[ $retry_count -lt $max_retries ]]; do
        print_info "Translation attempt $((retry_count + 1))/$max_retries" >&2
        
        if ! local response=$(translate_text "$text" 2>/dev/null); then
            print_warning "Translation attempt $((retry_count + 1)) failed" >&2
            ((retry_count++))
            sleep 2
            continue
        fi
        
        # Check if translation result is empty
        if is_translation_empty "$response"; then
            print_warning "Translation result is empty, retrying..." >&2
            ((retry_count++))
            sleep 2
            continue
        fi
        
        # Success - return the translation
        echo "$response"
        return 0
    done
    
    print_error "Failed to get valid translation after $max_retries attempts" >&2
    return 1
}

# Function to translate text using Gemini CLI
translate_text() {
    local text="$1"
    local prompt="Please translate the following Chinese text to English. Keep the original formatting, markdown syntax, and structure intact. Only translate the text content, not the markdown formatting. Preserve all markdown elements like #, *, -, [], (), etc.:

$text"
    
    # Use gemini and clean up the response
    if ! local response=$(echo "$prompt" | gemini 2>/dev/null); then
        # If Gemini CLI fails, return the original text
        print_warning "Gemini CLI failed for text: '$text', returning original" >&2
        echo "$text"
        return 0
    fi
    
    # Remove the first line (which is usually the prompt) and any trailing empty lines
    local cleaned_response=$(echo "$response" | sed '1d' | sed '/^$/d')
    
    # If the cleaned response is empty, return the original text
    if [[ -z "$cleaned_response" ]]; then
        print_warning "Cleaned response is empty for text: '$text', returning original" >&2
        echo "$text"
        return 0
    fi
    
    print_info "Raw response: '$response'" >&2
    print_info "Cleaned response: '$cleaned_response'" >&2
    
    echo "$cleaned_response"
    return 0
}

# Function to translate frontmatter
translate_frontmatter() {
    local frontmatter="$1"
    local translated_frontmatter=""
    
    while IFS= read -r line; do
        if [[ -z "$line" ]]; then
            translated_frontmatter+="$line"$'\n'
            continue
        fi
        
        # Check if line has key-value format
        if [[ "$line" =~ ^([^:]+):(.+)$ ]]; then
            local key="${BASH_REMATCH[1]}"
            local value="${BASH_REMATCH[2]}"
            
            # Remove quotes if present
            value=$(echo "$value" | sed 's/^[[:space:]]*["'\'']*//;s/["'\'']*[[:space:]]*$//')
            
            # Only translate certain fields
            if [[ "$key" =~ ^(title|description|summary)$ ]] && [[ -n "$value" ]]; then
                print_info "Attempting to translate field '$key' with value: '$value'" >&2
                if local translated_value=$(translate_text_with_retry "$value" 2>/dev/null); then
                    print_info "Successfully translated '$key': '$value' -> '$translated_value'" >&2
                    translated_frontmatter+="$key: \"$translated_value\""$'\n'
                else
                    print_warning "Failed to translate frontmatter field '$key', keeping original value" >&2
                    translated_frontmatter+="$line"$'\n'
                fi
            else
                translated_frontmatter+="$line"$'\n'
            fi
        else
            translated_frontmatter+="$line"$'\n'
        fi
    done <<< "$frontmatter"
    
    echo "$translated_frontmatter"
    return 0
}

# Function to translate a single file
translate_file() {
    local input_file="$1"
    local output_file="$2"
    
    print_info "Translating: $input_file"
    
    # Read the file content
    if ! local content=$(cat "$input_file" 2>/dev/null); then
        print_error "Failed to read file: $input_file"
        return 1
    fi
    
    # Extract frontmatter and content
    local frontmatter=""
    local markdown_content=""
    
    # Use awk to properly extract frontmatter and content
    if command -v awk &> /dev/null; then
        # Check if file has frontmatter (starts with ---)
        if [[ "$content" =~ ^--- ]]; then
            # Extract frontmatter (between first and second ---)
            frontmatter=$(echo "$content" | awk '
                BEGIN { in_frontmatter = 0; frontmatter = ""; content = ""; line_count = 0 }
                /^---$/ {
                    line_count++
                    if (line_count == 1) {
                        in_frontmatter = 1
                        next
                    } else if (line_count == 2) {
                        in_frontmatter = 0
                        next
                    }
                }
                {
                    if (in_frontmatter) {
                        frontmatter = frontmatter $0 "\n"
                    } else {
                        content = content $0 "\n"
                    }
                }
                END {
                    printf "%s", frontmatter
                }')
            
            # Extract content (after second ---)
            markdown_content=$(echo "$content" | awk '
                BEGIN { in_frontmatter = 0; content = ""; line_count = 0 }
                /^---$/ {
                    line_count++
                    if (line_count == 1) {
                        in_frontmatter = 1
                        next
                    } else if (line_count == 2) {
                        in_frontmatter = 0
                        next
                    }
                }
                {
                    if (!in_frontmatter) {
                        content = content $0 "\n"
                    }
                }
                END {
                    printf "%s", content
                }')
        else
            markdown_content="$content"
        fi
    else
        # Fallback to regex if awk is not available
        if [[ "$content" =~ ^---$'\n'(.+)$'\n'---$'\n'*([[:space:]]*.*)$ ]]; then
            frontmatter="${BASH_REMATCH[1]}"
            markdown_content="${BASH_REMATCH[2]}"
        else
            markdown_content="$content"
        fi
    fi
    
    # Translate frontmatter
    if [[ -n "$frontmatter" ]]; then
        print_info "Translating frontmatter..."
        local translated_frontmatter=$(translate_frontmatter "$frontmatter")
        # Note: translate_frontmatter now handles errors gracefully, so we don't need to check return code
    fi
    
    # Translate markdown content
    print_info "Translating content..."
    if ! local translated_content=$(translate_text_with_retry "$markdown_content" 2>/dev/null); then
        print_error "Failed to translate content for: $input_file"
        return 1
    fi
    
    # Create output directory if it doesn't exist
    local output_dir=$(dirname "$output_file")
    if ! mkdir -p "$output_dir" 2>/dev/null; then
        print_error "Failed to create output directory: $output_dir"
        return 1
    fi
    
    # Combine and write
    if [[ -n "$frontmatter" ]]; then
        if ! (echo "---" > "$output_file" && \
              echo "$translated_frontmatter" >> "$output_file" && \
              echo "---" >> "$output_file" && \
              echo "" >> "$output_file" && \
              echo "$translated_content" >> "$output_file") 2>/dev/null; then
            print_error "Failed to write output file: $output_file"
            return 1
        fi
    else
        if ! echo "$translated_content" > "$output_file" 2>/dev/null; then
            print_error "Failed to write output file: $output_file"
            return 1
        fi
    fi
    
    print_success "Translated file saved: $output_file"
    return 0
}

# Function to find and translate all Chinese files
translate_all_files() {
    local content_dir="${1:-./content}"
    
    print_info "Searching for Chinese files in: $content_dir"
    
    # Find all .zh-cn.md files
    local files=()
    while IFS= read -r -d '' file; do
        files+=("$file")
    done < <(find "$content_dir" -name "*.zh-cn.md" -print0)
    
    local count=${#files[@]}
    print_info "Found $count Chinese files to translate"
    
    if [[ $count -eq 0 ]]; then
        print_warning "No Chinese files found"
        return
    fi
    
    local translated_count=0
    local skipped_count=0
    local failed_count=0
    
    # Translate each file
    for file in "${files[@]}"; do
        local english_file="${file/.zh-cn.md/.en.md}"
        
        # Check if English file already exists
        if [[ -f "$english_file" ]]; then
            print_warning "Skipping $file - English version already exists: $english_file"
            ((skipped_count++))
            continue
        fi
        
        # Try to translate the file, but continue if it fails
        if translate_file "$file" "$english_file"; then
            ((translated_count++))
        else
            print_error "Failed to translate: $file"
            ((failed_count++))
        fi
        
        # Add a small delay to avoid overwhelming the CLI
        sleep 1
    done
    
    print_success "Translation completed! Translated $translated_count files, skipped $skipped_count files, failed $failed_count files"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTIONS] [FILE]"
    echo ""
    echo "Options:"
    echo "  --all [DIR]     Translate all Chinese files in directory (default: ./content)"
    echo "  --help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 --all                    # Translate all files in ./content"
    echo "  $0 --all content/notes      # Translate all files in content/notes"
    echo "  $0 file.zh-cn.md           # Translate single file"
    echo ""
    echo "Features:"
    echo "  - Automatic retry on empty translation results (max $MAX_RETRIES attempts)"
    echo "  - Preserves markdown formatting and structure"
    echo "  - Translates frontmatter fields (title, description, summary)"
    echo ""
    echo "Requirements:"
    echo "  - Gemini CLI must be installed and authenticated"
    echo "  - Run 'gemini auth' if you haven't authenticated yet"
}

# Main script
main() {
    echo "🚀 Gemini CLI Translation Script"
    echo "=================================="
    echo ""
    
    # Check if gemini CLI is available
    check_gemini
    
    # Parse arguments
    case "${1:-}" in
        --help|-h)
            show_usage
            exit 0
            ;;
        --all)
            translate_all_files "$2"
            ;;
        "")
            show_usage
            exit 1
            ;;
        *)
            # Single file translation
            local input_file="$1"
            local output_file="${2:-${input_file/.zh-cn.md/.en.md}}"
            
            if [[ ! -f "$input_file" ]]; then
                print_error "File not found: $input_file"
                exit 1
            fi
            
            translate_file "$input_file" "$output_file"
            ;;
    esac
}

# Run main function
main "$@" 