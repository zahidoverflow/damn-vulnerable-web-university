// API endpoint for LFI vulnerability testing
// This allows CLI scanners to detect the vulnerability

export default function handler(req, res) {
    // Enable CORS for scanner
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')

    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }

    const { file } = req.query

    if (!file) {
        return res.status(200).send('No file specified')
    }

    // VULNERABLE: Path traversal detection
    const hasPathTraversal = file.includes('../') ||
        file.includes('....//') ||
        file.includes('..\\') ||
        file.includes('%2e%2e') ||
        file.includes('%2e%2e%2f') ||
        file.includes('..%2f') ||
        file.includes('..%5c') ||
        file.includes('%252f') ||
        file.includes('%255c')

    const isEtcPasswd = file.toLowerCase().includes('etc/passwd') ||
        file.toLowerCase().includes('etc\\passwd') ||
        file.toLowerCase().includes('/etc/passwd')

    const isEtcShadow = file.toLowerCase().includes('etc/shadow') ||
        file.toLowerCase().includes('/etc/shadow')

    const isProcVersion = file.toLowerCase().includes('proc/version') ||
        file.toLowerCase().includes('/proc/version')

    const isProcCpuinfo = file.toLowerCase().includes('proc/cpuinfo') ||
        file.toLowerCase().includes('/proc/cpuinfo')

    const isWinIni = file.toLowerCase().includes('windows') &&
        file.toLowerCase().includes('win.ini')

    // Simulate LFI vulnerability - return file content with clear indicators
    if (hasPathTraversal && isEtcPasswd) {
        // Return simulated /etc/passwd content with clear LFI indicators
        res.setHeader('Content-Type', 'text/plain')
        return res.status(200).send(`root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
`)
    }

    if (hasPathTraversal && isEtcShadow) {
        // Return simulated /etc/shadow content
        res.setHeader('Content-Type', 'text/plain')
        return res.status(200).send(`root:$6$xyz$hashedpassword:18000:0:99999:7:::
daemon:*:18000:0:99999:7:::
bin:*:18000:0:99999:7:::
sys:*:18000:0:99999:7:::
`)
    }

    if (hasPathTraversal && isProcVersion) {
        // Return simulated /proc/version content
        res.setHeader('Content-Type', 'text/plain')
        return res.status(200).send(`Linux version 5.10.0-21-amd64 (debian-kernel@lists.debian.org) (gcc-10 (Debian 10.2.1-6) 10.2.1 20210110, GNU ld (GNU Binutils for Debian) 2.35.2) #1 SMP Debian 5.10.162-1 (2023-01-21)
`)
    }

    if (hasPathTraversal && isProcCpuinfo) {
        // Return simulated /proc/cpuinfo content
        res.setHeader('Content-Type', 'text/plain')
        return res.status(200).send(`processor	: 0
vendor_id	: GenuineIntel
cpu family	: 6
model		: 142
model name	: Intel(R) Core(TM) i5-8250U CPU @ 1.60GHz
`)
    }

    if (hasPathTraversal && isWinIni) {
        // Return simulated win.ini content
        res.setHeader('Content-Type', 'text/plain')
        return res.status(200).send(`; for 16-bit app support
[fonts]
[extensions]
[mci extensions]
[files]
[Mail]
MAPI=1
`)
    }

    // Don't show generic path traversal message - let scanner mark as safe
    // Return notice content for normal files
    const notices = {
        'admission-notice-2024.txt': `INSTITUTE OF SCIENCE AND TECHNOLOGY
Admission Notice for Academic Year 2024-2025

Applications are invited for admission to the following programs:
- B.Sc. in Computer Science and Engineering
- B.Sc. in Information Technology
- B.Sc. in Software Engineering

Eligibility: SSC & HSC with minimum GPA 3.5
Application Deadline: December 31, 2024
Admission Test Date: January 15, 2025

For more information, visit: www.ist.edu.bd/admission
Contact: admission@ist.edu.bd | +880-2-9876543`,
        'exam-schedule-fall2024.txt': `INSTITUTE OF SCIENCE AND TECHNOLOGY
Final Examination Schedule - Fall Semester 2024

CS401 - Cybersecurity Fundamentals
Date: December 10, 2024 | Time: 10:00 AM - 1:00 PM

CS301 - Web Development
Date: December 12, 2024 | Time: 2:00 PM - 5:00 PM

IT202 - Database Management Systems
Date: December 15, 2024 | Time: 10:00 AM - 1:00 PM

Exam Venue: Main Examination Hall
Students must bring their ID cards.`,
        'scholarship-announcement.txt': `INSTITUTE OF SCIENCE AND TECHNOLOGY
Merit-Based Scholarship Program 2024

We are pleased to announce scholarships for outstanding students:

Full Tuition Waiver: Top 5 students (CGPA 3.90+)
50% Tuition Waiver: Next 10 students (CGPA 3.75+)
25% Tuition Waiver: Next 20 students (CGPA 3.50+)

Application Process:
1. Submit academic transcripts
2. Write a 500-word essay
3. Provide two recommendation letters

Deadline: November 30, 2024
Contact: scholarship@ist.edu.bd`,
        'workshop-cybersecurity.txt': `INSTITUTE OF SCIENCE AND TECHNOLOGY
Cybersecurity Workshop 2024

Topic: "Ethical Hacking and Penetration Testing"
Speaker: Dr. Sarah Johnson, Cybersecurity Expert

Date: December 5-6, 2024
Time: 9:00 AM - 5:00 PM
Venue: Computer Lab 3

Topics Covered:
- Web Application Security
- SQL Injection
- Cross-Site Scripting (XSS)
- Security Testing Tools

Registration: Free for IST students
Limited seats available!
Register at: events@ist.edu.bd`
    }

    if (notices[file]) {
        res.setHeader('Content-Type', 'text/plain')
        return res.status(200).send(notices[file])
    }

    return res.status(200).send(`File not found: ${file}`)
}
