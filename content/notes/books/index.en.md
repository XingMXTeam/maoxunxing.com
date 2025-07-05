---
title: "Learning Computer Architecture"
date: 2019-11-25
tags:
  - Computer Science
custom_toc:
  - title: "Thoughts on 'Decoding Computer Science'"
  - title: "Thoughts After Reading Wang Yin's Blog"
  - title: "Cloud Native"
  - title: "DNS"
  - title: "File System - Glob Pattern"
  - title: "Linux"
  - title: "Functional Programming"
  - title: "TCP"
---
## Thoughts on 'Decoding Computer Science'
- **Core Idea**  
  > Convince yourself: I have mastered the entire discipline, but what I have mastered are the essential principles.  
- **Key Points**  
  - The core of a discipline is its principles, not trivial details.  
  - Understanding the essence of symbols, models, and computation helps build a global perspective.  
## **2. Symbols and Models**
- **Symbols**  
  - Symbols are just symbols, like `1, 2, 3`. They have no meaning in themselves but are tools to represent certain abstract concepts.  
- **Models**  
  - A model is something operable that can express the logic and relationships behind symbols.  
- **The Process from Symbols to Models**  
  - This process is called **syntactic analysis**, which involves parsing the structure of symbols to construct a corresponding model.  
- **Computation Graph**  
  - A computation graph is an abstract graphical method used to express the process of computation, reflecting the path of data flow.  
  - **Tip**: When you see symbols, try to visualize a picture to understand the model behind them.  
## **3. Way of Thinking**
- **Don't Solidify Your Way of Thinking**  
  - Keep an open mind, think flexibly, and avoid being limited by a single pattern.  
## **4. Core Concepts**
### **4.1 Expressions**
- An expression is a set of rules composed of symbols, used to describe the logic of a computation.  
### **4.2 Variables**
- A variable is a tool for representing intermediate processes, used to store and transmit information.  
### **4.3 Compilation**
- **Definition**: The process of translating a piece of code into another equivalent form.  
- **Characteristics**: Compiled code usually consists of simple instructions that can complete tasks efficiently.  
### **4.4 Parallel Computing**
- **Definition**: A mode of computation where calculations overlap in time.  
- **Advantages**: Improves computational efficiency.  
- **Disadvantages**: May introduce communication overhead or performance bottlenecks due to different capabilities of computing units.  
### **4.5 Functions**
- **Definition**: A construct with unknowns as input is called a function.  
- **Role**: Functions are the basic units of computation, used to encapsulate logic and operations.  
### **4.6 Computation**
- **Essence**: Computation is mechanized information processing.  
### Router Convergence Time
**Router Convergence Time** is the time it takes for all routers in a network to synchronize their routing information and reach a consistent state. In other words, when the network topology changes (e.g., link failure, device restart, or new link addition), routers need to recalculate the best paths and propagate these changes throughout the network. The process is considered complete only when all routers have updated their routing tables and reached a consensus.
---
## Thoughts After Reading Wang Yin's Blog
When discussing the essence of computer science, many people habitually regard mathematics as its core foundation. However, this view is not entirely accurate. The following is an in-depth discussion of this topic.
## 1. Mathematics is Not the Sole Foundation of Computer Science
### 1.1 The Essence of a Computer is a Tool
- **Versatility**: A computer is not just a tool for solving mathematical problems; it can also be used to handle various non-mathematical issues, such as:
  - Data analysis
  - Graphics rendering
  - Natural language processing
  - Game development
- **Interdisciplinary Applications**: The application scope of computer science far exceeds the realm of mathematics, covering multiple fields such as engineering, art, and social sciences.
### 1.2 The Role of Mathematics is Limited
- **Tool, Not Core**: Although mathematics plays an important role in certain areas of computer science (such as algorithm design, cryptography), it is not the foundation of all computer applications.
- **Importance of Other Disciplines**: Disciplines like logic, linguistics, and psychology have also had a profound impact on the development of computer science.
## 2. Hard-to-Understand Problems: Possibly Design Issues
### 2.1 The Core of Design Problems
- **Source of Complexity**: Many seemingly difficult problems may actually stem from unreasonable system design rather than the complexity of mathematics itself.
- **User Experience First**: A good system design should focus on the user's understanding and experience, rather than overly relying on complex mathematical models.
### 2.2 Methods for Optimizing Design
- **Modular Thinking**: Decompose complex problems into multiple simple sub-problems, solve them separately, and then integrate them.
- **Abstraction and Simplification**: Hide unnecessary details through abstraction and simplification to make the system easier to understand and maintain.
- **Iterative Improvement**: Continuously test and optimize the design to ensure the system's usability and efficiency.
## 3. The Core of Computer Science: The Ability to Solve Problems
### 3.1 Diverse Application Scenarios
- **Beyond Mathematics**: The core of computer science lies in how to use the computer as a tool to solve practical problems, not just mathematical ones.
- **Innovation and Practice**: Whether developing new software or optimizing existing systems, computer science emphasizes innovation and practical skills.
### 3.2 Interdisciplinary Integration
- **Multidisciplinary Collaboration**: The success of computer science often depends on collaboration with other disciplines, such as biology (bioinformatics), physics (simulation and modeling), etc.
- **Comprehensive Abilities**: Mastering multiple skills (programming, design, communication, etc.) is more conducive to the advancement of computer science than simply being proficient in mathematics.
---
## Cloud Native
| Concept         | Explanation                                                                                                                                                                                          | Others |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| **Cloud Native**| An architectural philosophy suitable for cloud computing. Applications or businesses that practice cloud-native technology concepts can maximize the benefits of cloud computing, including elastic computing, pay-as-you-go, no vendor lock-in, and high SLA. |        |
- **Additional Notes**:  
  - **Elastic Computing**: Dynamically adjust resource allocation based on business needs to improve efficiency and reduce costs.  
  - **Pay-as-you-go**: Pay only for what you use, avoiding resource waste.  
  - **No Vendor Lock-in**: Avoid dependency on a specific cloud service provider, enhancing flexibility.  
  - **High SLA (Service Level Agreement)**: Provides high availability and reliability guarantees.
## 2. The Cloud Computing Era
| Concept                | Explanation                                                                                                                               | Others |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| **Cloud Computing Era**| Centered around computing, with the three major components being storage, networking, and computing.                                        |        |
- **Additional Notes**:  
  - **Storage**: Data persistence and management, supporting distributed storage technologies.  
  - **Networking**: Provides efficient communication and data transmission capabilities, supporting virtualized network technologies.  
  - **Computing**: Core processing power, supporting elastic scaling and high-performance computing.
## 3. Cloud Native Technologies
| Concept                  | Explanation                                                                                                                               | Others |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| **Cloud Native Technologies**| Containers, Declarative APIs, Immutable Infrastructure, Service Mesh, Serverless.                                                       |        |
- **Technology Details**:  
  - **Containers**: Such as Docker and Kubernetes, provide lightweight virtualization environments for easy application deployment and management.  
  - **Declarative APIs**: Define system state through configuration files, simplifying management and automation.  
  - **Immutable Infrastructure**: Once deployed, the infrastructure is not modified. Updates are made by deploying new versions, ensuring consistency.  
  - **Service Mesh**: Such as Istio, provides communication, monitoring, and security for microservices.  
  - **Serverless**: Developers focus on business logic without worrying about the underlying servers, executing code on demand.
---
## DNS
DNS (Domain Name System) is a core service of the internet that translates human-readable domain names (e.g., `www.example.com`) into machine-readable IP addresses (e.g., `192.168.1.1`). The DNS system resolves domain names through a hierarchical structure, primarily consisting of **Local DNS** and **Authoritative DNS**.
## Local DNS
### Function
Local DNS serves as an intermediary layer between the user's device and the authoritative DNS, primarily responsible for the following tasks:
1. **Accepting and processing user DNS requests**  
   When a user enters a domain name in a browser, the Local DNS receives and processes the request.
   
2. **Caching DNS results**  
   To improve resolution speed and reduce network traffic, Local DNS caches previously queried DNS records. If a corresponding record exists in the cache, it returns the result directly without querying the authoritative DNS.
3. **Querying authoritative DNS when necessary**  
   If there is no corresponding DNS record in the cache, the Local DNS initiates a query to the authoritative DNS to obtain the latest resolution result.
### How It Works
1. A user's device initiates a DNS request, which is first sent to the configured Local DNS server (usually provided by an ISP or custom-configured).
2. The Local DNS checks its cache for a corresponding DNS record:
   - If it exists and has not expired, it returns the cached result directly.
   - If it does not exist or has expired, it queries the root DNS server, top-level domain (TLD) DNS server, and authoritative DNS server step-by-step to finally obtain the resolution result.
3. It returns the resolution result to the user's device and caches it for future use.
## Authoritative DNS
### Function
Authoritative DNS is the ultimate source for domain name resolution, storing and providing DNS records for a specific domain. Its main functions include:
1. **Storing DNS records for a domain**  
   The authoritative DNS server holds all DNS records for a specific domain, including A records (IPv4 address), AAAA records (IPv6 address), CNAME records (alias), MX records (mail server), etc.
2. **Serving as the final source for domain resolution**  
   When a Local DNS cannot obtain a resolution result from its cache, it queries the authoritative DNS. The record returned by the authoritative DNS is the definitive answer for the domain resolution.
### How It Works
1. The authoritative DNS server is managed by the domain owner or their hosting provider and is responsible for maintaining the domain's DNS records.
2. When a Local DNS queries the authoritative DNS, the authoritative DNS returns the corresponding DNS record based on the requested domain name.
3. The authoritative DNS does not cache records for other domains; it is only responsible for providing resolution information for the domains it manages.
---
## File System - Glob Pattern
Glob is a pattern language used for matching file paths, widely applied in file searching, build tools (like Webpack, ESLint), and scripts. It can quickly locate files that match specific rules using simple wildcards and pattern expressions.
Common wildcards include:
- `*`: Matches any number of characters (excluding the path separator `/`).
- `**`: Matches any number of characters (including the path separator `/`).
- `?`: Matches a single character.
- `[]`: Matches any single character within the brackets.
- `{}`: Matches any of the patterns within the braces (comma-separated).
- `@()`: Matches any of the patterns within the parentheses (pipe-separated).
---
## Special Syntax Parsing
### @() Syntax
`@()` is an advanced syntax in Glob patterns used to match one of several patterns separated by a pipe `|` within the parentheses. Its function is similar to `(pattern1|pattern2)` in regular expressions.
#### Syntax Format
```bash
@(<pattern1>|<pattern2>|...)
```
- Each pattern inside `@()` can be a filename, extension, or part of a path.
- A file path matches if it conforms to any of the patterns inside the parentheses.
---
## Example Analysis
Here is a specific Glob pattern example and its analysis:
```bash
eslint '@(src|docs)/**/*.@(js|jsx|md)'
```
### Analysis
1. **`@(src|docs)`**  
   Matches the `src` or `docs` folder.  
   - `src` and `docs` are the two alternative paths.
   - Only content within these two folders will be matched.
2. **`/**/`**  
   Matches any level of subdirectories.  
   - `**` indicates recursive matching of all subdirectories.
   - For example, `src/utils/helper.js` and `docs/guide/README.md` will both be matched.
3. **`*.@(js|jsx|md)`**  
   Matches files ending with `.js`, `.jsx`, or `.md`.  
   - `*` means the filename part can be any characters.
   - `.@(js|jsx|md)` means the file extension must be `js`, `jsx`, or `md`.
### Matching Results
Assuming the project structure is as follows:
```
project/
├── src/
│   ├── index.js
│   ├── utils/
│   │   └── helper.jsx
├── docs/
│   ├── README.md
│   └── guide/
│       └── tutorial.md
├── test/
│   └── example.js
```
After running the above command, the matched files are:
- `src/index.js`
- `src/utils/helper.jsx`
- `docs/README.md`
- `docs/guide/tutorial.md`
Note: `test/example.js` will not be matched because it is not in the `src` or `docs` folder.
---
## linux
## Terminal Page Scrolling Shortcuts
When viewing long output in the terminal, you can use the following shortcuts to scroll:
- **Scroll Up**: `Ctrl + b`
- **Scroll Down**: `Spacebar`
> **Additional Notes**:
>
> - These shortcuts are typically used in the paging mode of commands like `less` or `more`.
> - To exit paging mode, you can press the `q` key.
## Linux Command-Line Help Tools
### TLDR Pages
TLDR is a simplified command-line help tool that provides concise examples and explanations for common commands, suitable for quick reference.
- **Project URL**: [https://github.com/tldr-pages/tldr](https://github.com/tldr-pages/tldr)
- **Installation**:
  ```bash
  # Install with npm
  npm install -g tldr
  # Or use a package manager (e.g., Homebrew)
  brew install tldr
  ```
- **Usage Example**:
  ```bash
  tldr tar
  ```
  Example output:
  ```plaintext
  tar
  Archiving utility.
  Often combined with a compression method, such as gzip or bzip2.
  - Create an archive from files:
    tar cf target.tar file1 file2 file3
  - Extract an archive in a specific directory:
    tar xf source.tar -C directory
  ```
> **Features**:
>
> - Provides concise command examples, avoiding lengthy official documentation.
> - Supports multiple operating systems and languages.
## Packaging a Web App into a Client
### Pake Tool
Pake is an open-source tool that can quickly package a web application into a desktop client, supporting cross-platform operation.
- **Project URL**: [https://github.com/tw93/Pake](https://github.com/tw93/Pake)
- **Features**:
  - Supports packaging any webpage into a desktop application.
  - Provides features like custom windows and icons.
  - Supports Windows, macOS, and Linux platforms.
- **Installation and Usage**:
  ```bash
  # Clone the project
  git clone https://github.com/tw93/Pake.git
  # Install dependencies
  cd Pake
  npm install
  # Package the web app
  npm run build --url=https://example.com --name=MyApp
  ```
- **Parameter Explanation**:
  - `--url`: Specifies the URL of the webpage to be packaged.
  - `--name`: Specifies the name of the generated application.
> **Use Cases**:
>
> - Packaging frequently used online tools (like Notion, Trello) into desktop clients.
> - Quickly building lightweight desktop application prototypes.
## Common Tools and Operations
### Viewing User Action History
- **`history` tool**  
  - Used to view the user's command history on the computer.  
  - Example: The `history` command lists the current user's command history.
### Checking if a Port has a Service
- Use `telnet` to check if the target IP and port are open:
  ```bash
  telnet 1.1.1.1 1232
  ```
  - If the connection is successful, it means a service is running on the target port.
  - If the connection fails, the port may not be open or the service may not be started.
## Classic Interview Question: What happens when you press Enter after `ping`?
When we type `ping <target_IP>` in the terminal and press Enter, the following is the complete process:
### 1. View the Routing Table
- Use `route -n` to view the routing table:
  ```bash
  route -n
  ```
  - The routing table helps determine which network interface card (NIC) the data packet needs to be sent through.
### 2. View Network Interface Information
- Use `ifconfig` to view network interface information:
  ```bash
  ifconfig
  ```
  - Determine the subnet mask and IP address range of the current NIC.
  - Judge whether the target IP is within the current subnet:
    - If the target IP is in the subnet, directly obtain the target device's MAC address via the ARP protocol.
    - If the target IP is not in the subnet, it needs to be forwarded through the gateway.
### 3. Get the MAC Address of the Target IP
- Use `arp -a` to view the ARP cache table:
  ```bash
  arp -a
  ```
  - The ARP protocol is responsible for resolving the target IP address to the corresponding MAC address.
  - Packet sending is based on MAC addresses, not directly on IP addresses.
### 4. Packet Sniffing to Analyze ARP Requests
- Use `tcpdump` to capture ARP requests:
  ```bash
  tcpdump -i eth0 arp
  ```
  - Analyze the ARP request and response process to confirm the target device's MAC address.
### 5. Domain Name Resolution (if the target is a domain)
- If the target is a domain name (e.g., `www.example.com`), domain name resolution must be performed first:
  - **`gethostbyname` function**  
    - Resolves the domain name through glibc's `gethostbyname` function.
    - The resolution order is determined by the `/etc/nsswitch.conf` file:
      - First, check the `/etc/hosts` file.
      - Then, query the DNS server.
  - **`nslookup` tool**  
    - Directly reads the `nameserver` configuration from `/etc/resolv.conf`.
    - Does not call `gethostbyname`, nor does it check `/etc/hosts` or `/etc/nsswitch.conf`.
### 6. Send ICMP Packet
- `ping` uses the ICMP protocol to send request packets:
  - Constructs an ICMP Echo Request data packet.
  - The packet is sent to the target device through the NIC.
- The target device returns an ICMP Echo Reply data packet upon receipt.
## UDP Application: DNS Protocol
- DNS queries typically use the UDP protocol (port 53).
- Process:
  1. The client sends a query request to the DNS server.
  2. The DNS server returns the resolution result.
## Debugging Tools: `strace` and Packet Sniffing
- **`strace` command**  
  - Used to trace system calls and signals.
  - Example: Trace the system calls of the `ping` command:
    ```bash
    strace ping www.example.com
    ```
- **Packet Sniffing Tools**  
  - Use `tcpdump` or `Wireshark` to capture network traffic and analyze packet content.
  - Example: Capture ICMP packets:
    ```bash
    tcpdump -i eth0 icmp
    ```
  - pcap: Use `editcap` to trim the captured packet to avoid it being too large, e.g., `editcap -A start_time -B end_time test.pcap test-filtered.pcap`
  - Then load it into Wireshark.
---
## Functional Programming
## Characteristics of Functional Programming
- **Pure Functions**: The output of a function depends only on its input, with no side effects.
- **Immutability**: Data cannot be changed; state changes are achieved by creating new data.
- **Higher-Order Functions**: Functions can be passed as arguments or returned as values, supporting composition and reuse.
- **Utility Methods**: Often used for writing general-purpose utility functions, such as array operations, string manipulation, etc.
**Typical Application Scenarios**:
- In React components, functional components use the pure function characteristic to ensure that the component's state and behavior are predictable.
- In data processing logic, functional programming is used to simplify complex data flow operations.
## Characteristics of Object-Oriented Programming
- **Encapsulation**: Encapsulates data and behavior into classes, hiding internal implementation details.
- **Inheritance**: Achieves code reuse through inheritance, reducing redundant code.
- **Polymorphism**: Different objects respond differently to the same message, enhancing flexibility.
- **Modeling Capability**: More suitable for abstracting and modeling complex systems.
**Typical Application Scenarios**:
- In framework design, OOP is used to build reusable modules and components.
- In complex business logic, classes and objects are used to organize code, improving maintainability.
## Combined Use of Functional and Object-Oriented Programming
### Combination Principles
- **Choose the appropriate approach based on needs**: 
  - If you need to handle large data streams or utility methods, prioritize functional programming.
  - If you need to build complex system models or frameworks, prioritize object-oriented programming.
- **Mixed Use**: In a project, you can flexibly combine the two programming paradigms according to the needs of different modules.
### Practical Cases
1. **React Development**:
   - Functional components use the pure function characteristic to ensure predictable component behavior.
   - State management libraries (like Redux) use functional programming to handle state updates.
   - In large projects, complex logic can still be organized through class components or OOP methods.
2. **Node.js Backend Development**:
   - Use OOP to build the service layer and model layer for easy reuse and extension.
   - Use functional programming in utility functions to simplify data processing logic.
## Analysis of Applicable Scenarios
### Scenarios for Functional Programming
- **Utility Functions**: Such as date formatting, string manipulation, array operations, etc.
- **Data Flow Processing**: Such as state management in Redux, event stream processing in RxJS.
- **UI Rendering**: React functional components use the pure function characteristic to ensure UI rendering consistency.
### Scenarios for Object-Oriented Programming
- **Framework Design**: Such as frameworks like Express, Midway, which use OOP to build extensible modules.
- **Complex Business Logic**: Such as order, payment, and inventory modules in an e-commerce system, where code is organized through classes and objects.
- **State Management**: Such as in game development, where OOP is used to manage character states and behaviors.
---
## TCP
## RFC 1180 - A TCP/IP Tutorial
### Overview
[RFC 1180](https://datatracker.ietf.org/doc/html/rfc1180?spm=ata.21736010.0.0.7fef5b82m2OFdt) is a classic TCP/IP tutorial document published by the IETF, aimed at helping beginners understand the basic concepts and working principles of the TCP/IP protocol stack.
### Main Content
- **TCP/IP Basics**: Introduces the layered structure of the protocol stack (Application, Transport, Network, Link).
- **IP Protocol**: Explains IP addresses, subnetting, routing, and other topics in detail.
- **TCP and UDP**: Compares the characteristics and applicable scenarios of the two transport protocols.
- **Common Application Layer Protocols**: The working mechanisms of protocols like HTTP, FTP, SMTP, etc.
### Reading Suggestions
- Suitable for readers with some basic knowledge of computer networks.
- Combine with practical network environment experiments, for example, by observing protocol interactions with a packet sniffer.
## "TCP/IP Illustrated" Series
"TCP/IP Illustrated" is a classic series of computer networking books that deeply analyzes the design and implementation details of the TCP/IP protocol stack. The series is usually divided into multiple volumes, covering comprehensive content from basic theory to advanced applications.
## "The Art of Wireless Packet Analysis" Recommendation
### Overview
"The Art of Wireless Packet Analysis" is a book focused on wireless network packet sniffing techniques, emphasizing how to use packet sniffing tools to analyze wireless communication data streams and uncover information hidden in wireless signals.
### Main Content
- **Wireless Network Basics**: Includes the basic principles of wireless communication protocols like Wi-Fi, Bluetooth, etc.
- **Packet Sniffer Usage**: Detailed introduction to the operation of tools like Wireshark, AirPcap, etc.
- **Data Analysis Techniques**: How to interpret packet sniffing results, identify abnormal traffic, or potential security threats.
- **Practical Case Studies**: Demonstrates the application value of packet sniffing techniques through real-world scenarios.
### Learning Suggestions
- **Familiarize with Basics**: It is recommended to master basic network knowledge before studying this book.
- **Focus on Practice**: Prepare a device that supports wireless packet sniffing and practice while learning.
- **Pay Attention to Security**: Understand the legal and ethical issues that may be involved in packet sniffing and avoid misuse of the technology.
## TCP Three-Way Handshake
- Host1 sends `SYN`, enters `SYN-SENT` state.
   - The **initiator (Host1)** sends a TCP segment with the `SYN` flag to the **receiver (Host2)**. This segment contains a randomly generated Initial Sequence Number (ISN), which is used to identify the starting point of the subsequent data stream.
- Host2 receives `SYN`, enters `SYN-RECEIVED` state, and sends `SYN-ACK`.
   - After receiving Host1's `SYN` packet, the **receiver (Host2)** replies with a TCP segment with the `SYN` and `ACK` flags.
   - Host2 also generates its own ISN (`y`) and sends it to Host1 via the `SYN`.
   - At the same time, Host2 acknowledges receipt of Host1's `SYN` via `ACK`, setting the acknowledgment number to `x+1` (indicating the next byte it expects to receive).
   - At this point, Host2 enters the `SYN-RECEIVED` state.
- Host1 receives `SYN-ACK`, sends `ACK`, and both parties enter `ESTABLISHED` state.
   - After receiving Host2's `SYN-ACK` packet, the **initiator (Host1)** sends a TCP segment with the `ACK` flag.
   - Host1 sets the acknowledgment number to `y+1`, indicating the next byte it expects to receive from Host2.
   - At this point, both Host1 and Host2 enter the `ESTABLISHED` state, the connection is successfully established, and data transmission can begin.
### **Summary of State Changes in the Three-Way Handshake**
- **Host1**:
  1. Initial state: `CLOSED`
  2. After sending `SYN`: `SYN-SENT`
  3. After receiving `SYN-ACK`: `ESTABLISHED`
- **Host2**:
  1. Initial state: `LISTEN`
  2. After receiving `SYN`: `SYN-RECEIVED`
  3. After receiving `ACK`: `ESTABLISHED`
### **Why is a Three-Way Handshake Necessary?**
1. **Negotiate Initial Sequence Numbers**:
   - TCP uses sequence numbers to ensure the order and reliability of data packets. The three-way handshake allows both parties to exchange their initial sequence numbers, preparing for subsequent data transmission.
2. **Prevent the Influence of Historical Connections**:
   - If there are delayed or duplicate old connection requests in the network, the three-way handshake can detect and discard these invalid requests, avoiding erroneous connections.
3. **Two-Way Confirmation**:
   - Ensures that both parties can send and receive data normally. For example, Host1 confirms that Host2 can receive data, and Host2 also confirms that Host1 can receive data.
## Four-Way Handshake
- First Handshake: Send FIN (initiated by the active closer)
   - Host1 (the active closer) decides to close the connection and sends a segment with the FIN flag to Host2. FIN means "I have no more data to send." At this point, Host1 enters the FIN-WAIT-1 state.
- Second Handshake: Send ACK (responded by the passive closer)
   - After receiving the FIN from Host1, Host2 replies with a segment with the ACK flag.
      - The ACK acknowledgment number is set to x+1, indicating that Host1's FIN has been received.
      - At this point, Host2 enters the CLOSE-WAIT state, while Host1 enters the FIN-WAIT-2 state.
      - Note: At this time, Host2 may still have data to send to Host1, so the connection is not completely closed.
- Third Handshake: Send FIN (initiated by the passive closer)
   - When Host2 has finished all data transmission, it also sends a segment with the FIN flag, meaning "I also have no more data to send." At this point, Host2 enters the LAST-ACK state.
- Fourth Handshake: Send ACK (responded by the active closer)
   - After receiving the FIN from Host2, Host1 replies with a segment with the ACK flag.
   - The ACK acknowledgment number is set to y+1, indicating that Host2's FIN has been received.
   - At this point, Host1 enters the TIME-WAIT state, while Host2 directly enters the CLOSED state.
## TIME-WAIT
During the TCP connection closing process, when one party (e.g., Host1) sends the final `ACK` confirmation packet (the fourth handshake), it enters the `TIME-WAIT` state. In this state, that party waits for a period of time (usually **2 times the Maximum Segment Lifetime, 2 * MSL**) before completely closing the connection.
- **MSL (Maximum Segment Lifetime)**: The maximum time a TCP segment can exist in the network. It is usually set to 2 minutes, so the `TIME-WAIT` duration is typically 4 minutes.
### Why is TIME-WAIT needed?
#### **(1) To ensure the final ACK is received**
When a TCP connection is closed, the two parties terminate the connection through a Four-Way Handshake. If the last `ACK` sent by Host1 is lost, Host2 will not be able to confirm that the connection has been successfully closed and will re-send the `FIN` message. Without the `TIME-WAIT` state, Host1 might close the connection directly, causing Host2 to never receive the confirmation and thus get stuck in an error state.
By maintaining the `TIME-WAIT` state, Host1 can continue to listen to the network. If it receives a re-sent `FIN` from Host2, it can send the `ACK` again to complete the connection closure.
#### **(2) To clean up delayed packets in the network**
There may be delayed or duplicate segments in the network (e.g., due to routing issues or network congestion). If the connection is closed immediately, these lingering packets might be mistaken as part of a new connection, leading to data confusion.
The existence of the `TIME-WAIT` state ensures that all packets related to the current connection can disappear from the network, preventing them from interfering with subsequent new connections.
#### **(3) To prevent packets from old connections from affecting new connections**
TCP uses a four-tuple (source IP, source port, destination IP, destination port) to identify a connection. If a connection is closed and a new connection is immediately established using the same four-tuple, lingering packets from the old connection might be mistaken as belonging to the new connection, leading to data corruption or protocol errors.
By waiting for the `TIME-WAIT` duration, it can be ensured that all packets from the old connection have expired, thus allowing the four-tuple to be safely reused.
## Retransmission Mechanism
TCP uses an acknowledgment mechanism (ACK) to ensure that data packets are successfully received. If the sender does not receive an acknowledgment (ACK) from the receiver within a certain period, the retransmission mechanism is triggered.
- Timeout Retransmission (RTO, Retransmission Timeout):
   - The sender sets a timeout period (RTO, Retransmission Timeout) for each data packet.
   - If an ACK is not received within the RTO period, the sender will retransmit the data packet.
- Fast Retransmit:
   - If the receiver detects a lost packet (e.g., by receiving out-of-order packets), it will send multiple duplicate ACKs.
   - When the sender receives 3 duplicate ACKs, it will immediately retransmit the lost packet without waiting for the RTO to expire.
## Packet Sniffing Protocol
`(tcp.dstport == 6001 or tcp.srcport == 6001) && tcp.flags==2 && tcp.time_relative>0` 
- In the TCP protocol, a flags field value of 2 indicates this is a SYN packet.
- tcp.time_relative>0: This part of the condition filters for packets with a relative time greater than 0. Relative time usually refers to the time offset from the start of the capture to the current packet. This means it filters all packets that occurred after the capture started.
- Use the `sysctl -a` command to view system kernel parameters. You found a parameter related to the retry mechanism: `net.netfilter.nf_conntrack_tcp_max_retrans`, with a value of 3.
---
```shell
set -e
while true
nc -z -v -w 1 127.0.0.1 6001 2>&1 | grep Connected > /dev/null
done
```
`cat ip_local_port_range` to view the port range
`k8s NodePort --service-node-port-range ` k8s allocates ports within the specified range
In a Kubernetes (K8s) cluster, `kube-proxy` is one of the key components responsible for implementing network communication and service load balancing. It ensures that traffic is correctly routed to the backend Pods.
## X11 Protocol
