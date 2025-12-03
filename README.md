# 🎓 Damn Vulnerable Web University

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Live-000000?logo=vercel&logoColor=white)](https://ist-edu-bd.vercel.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)

> **⚠️ SECURITY WARNING**: This is an intentionally vulnerable web application for educational and authorized security testing purposes only. **DO NOT** deploy in production environments or expose to untrusted networks.

**Live Demo**: [https://ist-edu-bd.vercel.app](https://ist-edu-bd.vercel.app)

---

## 📖 Overview

An educational web application deliberately designed with **OWASP Top 10** vulnerabilities for:

- 🎯 **Security Testing** - Practice penetration testing and vulnerability assessment
- 📚 **Cybersecurity Education** - Learn real-world web application vulnerabilities
- 🔬 **Scanner Development** - Test and validate security scanning tools
- 💼 **Professional Training** - Hands-on security training for developers and pentesters

Built with modern web technologies (React + Vite) and realistic university website features to simulate production-like environments.

---

## 🚀 Quick Start (Docker - Recommended)

**Prerequisites**: Docker and Docker Compose installed ([Get Docker](https://docs.docker.com/get-docker/))

### One-Command Setup

```bash
# Clone and run
git clone https://github.com/zahidoverflow/damn-vulnerable-web-university.git
cd damn-vulnerable-web-university
docker compose up -d
```

**Access**: Open [http://localhost:3000](http://localhost:3000)

### Alternative: Pre-built Docker Image

```bash
# Pull from Docker Hub (if available)
docker pull zahidoverflow/dvwu:latest
docker run -d -p 3000:80 zahidoverflow/dvwu
```

---

## 🐛 Vulnerability Catalog

This application contains **7 exploitable vulnerabilities** mapped to OWASP Top 10 2021:

| # | Type | Endpoint | Method | OWASP | Severity |
|---|------|----------|--------|-------|----------|
| 1 | **Cross-Site Scripting (Reflected)** | `/api/comments` | GET | A03:2021 | 🔴 High |
| 2 | **Cross-Site Scripting (Stored)** | `/api/comments` | POST | A03:2021 | 🔴 Critical |
| 3 | **SQL Injection (Authentication)** | `/api/portal` | POST | A03:2021 | 🔴 Critical |
| 4 | **SQL Injection (Search)** | `/api/search` | GET | A03:2021 | 🔴 High |
| 5 | **Local File Inclusion (LFI)** | `/api/notices` | GET | A01:2021 | 🟠 High |
| 6 | **CRLF Injection** | `/api/newsletter` | POST | A03:2021 | 🟡 Medium |
| 7 | **Open Redirect** | `/api/redirect` | GET | A01:2021 | 🟡 Medium |

**📋 Full Documentation**: [Vulnerability Report](docs/VULNERABILITY_REPORT.md)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, React Router v6, Axios |
| **Backend** | Vercel Serverless Functions (Node.js) |
| **Deployment** | Docker, Nginx, Vercel |
| **Build** | Vite (ES Modules, Fast HMR) |

---

## 📦 Installation Options

### Option 1: Docker (Production-Ready)

```bash
# Build and run with Docker Compose
docker compose up -d

# View logs
docker compose logs -f

# Stop
docker compose down
```

**Includes**: Nginx web server, optimized production build, health checks

### Option 2: Local Development

```bash
# Install dependencies
npm install

# Run development server (with HMR)
npm run dev
```

**Development server**: `http://localhost:5173` (Vite default)

### Option 3: Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

**Output**: `dist/` directory

---

## 🧪 Testing Vulnerabilities

### Example Exploits

#### 1. XSS (Reflected)
```bash
curl "http://localhost:3000/api/comments?comment=<script>alert(document.domain)</script>"
```

#### 2. SQL Injection (Login Bypass)
```http
POST /api/portal
Content-Type: application/json

{
  "username": "admin' OR '1'='1' --",
  "password": "irrelevant"
}
```

#### 3. Path Traversal (LFI)
```bash
curl "http://localhost:3000/api/notices?file=../../../../etc/passwd"
```

#### 4. CRLF Injection
```bash
curl -X POST http://localhost:3000/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com\r\nX-Injected-Header: true"}'
```

### Automated Scanning

Compatible with popular security tools:
- **OWASP ZAP** - Web application scanner
- **Burp Suite** - Penetration testing toolkit
- **SQLMap** - SQL injection automation
- **Nikto** - Web server scanner
- **Custom Scripts** - API-friendly for tool development

---

## 📁 Project Structure

```
damn-vulnerable-web-university/
│
├── api/                      # Serverless API endpoints
│   ├── comments.js          # XSS vulnerabilities
│   ├── portal.js            # SQL injection (auth)
│   ├── search.js            # SQL injection (search)
│   ├── notices.js           # LFI/Path traversal
│   ├── newsletter.js        # CRLF injection
│   └── redirect.js          # Open redirect
│
├── src/                      # React application source
│   ├── components/          # Reusable UI components
│   ├── pages/              # Page components
│   ├── App.jsx             # Root component
│   └── main.jsx            # Entry point
│
├── public/                   # Static assets
├── docs/                     # Documentation
│   ├── VULNERABILITY_REPORT.md
│   └── CONTEXT.md
│
├── Dockerfile               # Multi-stage Docker build
├── docker-compose.yml       # Docker Compose configuration
├── nginx.conf              # Nginx server config
├── vercel.json             # Vercel deployment
├── vite.config.js          # Vite configuration
└── package.json            # Dependencies & scripts
```

---

## 🔒 Security Disclaimer

### ⚠️ EDUCATIONAL USE ONLY

**This application is INTENTIONALLY INSECURE by design.**

✅ **Authorized Uses:**
- Security research and education
- Penetration testing practice
- Security tool development
- Authorized security assessments

❌ **Prohibited:**
- Production deployment
- Processing real user data
- Connecting to production databases
- Unauthorized system testing
- Any illegal activities

### 🔐 Legal Notice

Unauthorized access to computer systems is **illegal** under laws including:
- Computer Fraud and Abuse Act (CFAA) - USA
- Computer Misuse Act - UK
- Cybercrime laws in your jurisdiction

**Always obtain written authorization** before security testing.

---

## 📚 Documentation

- **[Complete Vulnerability Analysis](docs/VULNERABILITY_REPORT.md)** - Detailed technical breakdown
- **[Project Context](docs/CONTEXT.md)** - Architecture and implementation details
- **[API Documentation](#testing-vulnerabilities)** - Endpoint reference and examples

---

## 🤝 Contributing

We welcome contributions! To add vulnerabilities or improve the project:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/new-vuln`)
3. **Commit** changes (`git commit -m 'Add XXE vulnerability'`)
4. **Push** to branch (`git push origin feature/new-vuln`)
5. **Open** a Pull Request

**Ideas for Contributions:**
- Additional OWASP Top 10 vulnerabilities (XXE, SSRF, Deserialization)
- Improved documentation
- Docker image optimization
- Security tool integration examples

---

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) for details.

**TL;DR**: Free to use, modify, and distribute. No warranty provided.

---

## 👥 Authors & Contributors

**Primary Author**: [zahidoverflow](https://github.com/zahidoverflow)  
**Contributors**: [osmanfaruque](https://github.com/osmanfaruque)

**Academic Context**: Developed as part of a cybersecurity research project at Institute of Science and Technology (IST).

---

## 🙏 Acknowledgments

- **DVWA** (Damn Vulnerable Web Application) - Inspiration
- **OWASP** - Vulnerability classifications and resources
- **React & Vite** - Modern development tools
- **Vercel** - Serverless deployment platform

---

## 💬 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/zahidoverflow/damn-vulnerable-web-university/issues)
- **Discussions**: [GitHub Discussions](https://github.com/zahidoverflow/damn-vulnerable-web-university/discussions)
- **Pull Requests**: [Submit PR](https://github.com/zahidoverflow/damn-vulnerable-web-university/pulls)

---

## 🎓 Learning Resources

**New to Web Security?** Check out:
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)
- [OWASP WebGoat](https://owasp.org/www-project-webgoat/)

---

<div align="center">

**⚡ Built with React • Secured by Nothing • Vulnerable by Design ⚡**

*Remember: With great power comes great responsibility. Use ethically!*

</div>

