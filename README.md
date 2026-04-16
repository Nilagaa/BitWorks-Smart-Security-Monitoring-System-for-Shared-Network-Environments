# BitWorks: Smart Security Monitoring System

BitWorks is a standalone web-based monitoring system designed for shared computer environments such as internet cafés, school laboratories, and small business networks. The system provides real-time visibility of user activity, detects suspicious behavior using predefined rules, and generates alerts for administrators through a centralized dashboard.

---

## Overview

Many existing internet café systems focus only on billing and session management, with limited monitoring capabilities. BitWorks addresses this gap by providing a lightweight monitoring and detection system that operates alongside existing platforms without modifying them.

The system focuses on:
- User activity monitoring
- Rule-based detection
- Alert generation
- Activity logging
- Role-based access control

---

## Key Features

- Secure Authentication using SHA-256 hashing
- Role-Based Access Control (Admin and Staff)
- Domain-Level Activity Monitoring (simulated)
- Rule-Based Detection (e.g., failed login attempts, restricted domains)
- Real-Time Alerts and Notifications
- Centralized Dashboard for monitoring system activity
- Login Records and Activity Logs
- Report Generation and CSV Export
- Settings for configurable monitoring behavior

---

## System Scope

BitWorks is a prototype system developed for academic purposes. It focuses on monitoring and detection within controlled environments and does not include:

- Deep packet inspection
- Malware detection
- Intrusion prevention or blocking
- Real-time network traffic analysis (Mbps)
- Full enterprise-level security features

---

## Technology Stack

Frontend:
- React 18
- TypeScript
- Tailwind CSS

Backend (planned / simulated in prototype):
- Python (Flask)

Development Tools:
- Node.js
- Vite

Database:
- MySQL / SQLite (conceptual design)

Standards:
- SHA-256 for password hashing
- ISO/IEC 25010 for system evaluation

---

## System Architecture

BitWorks follows a three-tier architecture:

1. Presentation Layer  
   - User interface (Dashboard, Alerts, Logs)

2. Application Layer  
   - Authentication  
   - Monitoring  
   - Detection  
   - Alert generation  

3. Data Layer  
   - User data  
   - Logs  
   - Alerts  
   - Restricted domains  

---

## How It Works (Prototype)

The system uses simulated data to demonstrate monitoring behavior:

- Failed login attempts are tracked and generate alerts when thresholds are reached
- Restricted domain access is simulated using predefined inputs
- All events are logged and displayed in real time
- Dashboard and reports update dynamically based on system state

---

## Demo Capabilities

The prototype allows testing of:

- User login and failed login detection
- Adding and managing users
- Generating alerts
- Simulating restricted domain access
- Viewing logs and reports
- Role-based access restrictions (Admin vs Staff)

Note: Data resets on refresh as this is a frontend-driven prototype.

---

## Target Users

- Internet café administrators
- School computer laboratory managers
- Small business network administrators

---

## Project Status

- Frontend: Functional prototype (React-based)
- Backend: Not yet integrated (simulation-based)
- Database: Conceptual design completed

---

## Limitations

- Uses simulated monitoring data
- No real-time network packet inspection
- No automatic blocking of threats
- Depends on predefined rules for detection

---

## Future Improvements

- Backend integration using Flask
- Persistent database storage
- Real-time workstation monitoring via client agents
- Enhanced reporting and analytics
- Improved user management features

---

## Author

Developed as part of an academic project in SAD 003.

---
