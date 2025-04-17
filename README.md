# WhatsApp Chatbot for Efficient Customer Support & Engagement🤖📱[In Progress]

## Project Overview

**Project Name:** QuickAssist Chatbot  
**Version:** 1.0  

[![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/ZYrZ032HY6E)

The **QuickAssist Chatbot** is an automated solution designed to provide customers with information related to a company, entirely through WhatsApp. The chatbot interacts with a database to provide instant responses to frequently asked questions (FAQs). Admins can manage FAQs through an admin platform built with Next.js and TypeScript. Users interact with the chatbot through WhatsApp, receiving real-time responses.



https://github.com/user-attachments/assets/11f3e058-a069-43db-a331-48dad179781a
 




## Problem Solved 🚀

The **WhatsApp-Chatbot** solves the problem of customers needing to wait for human support to get information. By providing a chatbot that can answer questions automatically via WhatsApp, users can get the information they need instantly. This leads to a more efficient customer experience and less burden on customer service teams.

## Features ✨

- **WhatsApp Integration** 📲: Customers can interact with the chatbot via WhatsApp to get company-related information.
- **Database-Driven FAQ** 🗃️: The chatbot uses a database to store frequently asked questions and their corresponding answers.
- **Admin Platform** 🖥️: Admins can manage FAQs, send direct messages to users, and review unanswered questions to improve chatbot responses.
- **Version 1** 🏗️: Database-driven responses to commonly asked questions.
- **Version 2 (Future)** 🤖: AI-powered chatbot that improves over time with machine learning and continuous training.

## Tech Stack 💻

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB (used for storing FAQs and user data)
- **Frontend**: Next.js, TypeScript (admin platform to manage FAQs)
- **WhatsApp API**: Integration with WhatsApp Business API for user interaction
- **AI Model (Future)**: AI and ML for training and improving chatbot responses

## SYSTEM DESIGNS
# WhatsApp Chatbot Event Flow Table

| No. | Event | Trigger | Source | Activity | Response | Destination |
|-----|-------|---------|--------|----------|----------|-------------|
| 1 | User sends a message on WhatsApp | Message Received | User (WhatsApp) | Capture and parse incoming user message | Query the database for matching FAQ | WhatsApp Chatbot (Backend) |
| 2 | Bot finds a matching FAQ | Message Parsed | Chatbot | Fetch answer from database | Send response back to user via WhatsApp | WhatsApp User |
| 3 | Bot doesn't find a matching FAQ | No Match Found | Chatbot | Store question in "Unanswered Questions" | Send default message with options or notify for human help | WhatsApp User, Admin Panel |
| 4 | Admin adds/edits FAQs | Form Submission | Admin Panel | Insert or update FAQ entry in the database | Confirm update to the admin | MongoDB |
| 5 | Admin checks unanswered questions | View Page Load | Admin Panel | Fetch unanswered queries from database | Display list of unanswered user queries | Admin Panel UI |
| 6 | Admin sends a manual reply to user | Send Button Clicked | Admin Panel | Send custom message to user via WhatsApp API | Deliver manual response to user | WhatsApp User |
| 7 | User registers through initial message | First-time Message | WhatsApp User | Create new user entry in the database | Send welcome message or options | WhatsApp Chatbot (Backend) |
| 8 | Admin views all users | View Users Clicked | Admin Panel | Fetch user data from database | Display user list with metadata | Admin Panel UI |


## Screenshots ✨
![image](https://github.com/user-attachments/assets/3f63c2d3-dd03-4364-a979-bcfb2048fcbe)


## ADMIN PANEL

## DASHBOARD
![image](https://github.com/user-attachments/assets/d4eab074-41b1-4926-bb41-eb77588258af)

## FAQs
![image](https://github.com/user-attachments/assets/4191aae6-2294-4d4c-a4c4-32c4ea839ecc)

## ADD FAQs
![image](https://github.com/user-attachments/assets/59a6d786-3d0b-41b9-b852-6f6dde6f68c5)

## ADMIN MESSAGE
![image](https://github.com/user-attachments/assets/37d7899e-22b7-4f9f-a082-1facfb4d7924)
![image](https://github.com/user-attachments/assets/8dcaa0d2-b925-412c-9b0d-9c2343d03acf)

## Module Training
![image](https://github.com/user-attachments/assets/35b104ea-986c-4d0d-b38e-13bc284aee7f)

## USERS
![image](https://github.com/user-attachments/assets/ba74d705-7251-4303-a904-ee9bb2eec8a2)



## Installation 🛠️

### Prerequisites 📋

- **Node.js**: Ensure Node.js is installed.
- **MongoDB**: A MongoDB instance is required for storing FAQs and user data.
