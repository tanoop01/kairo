# KAIRO

KAIRO is a web-based legal assistance platform built around a Retrieval-Augmented Generation (RAG) system. It helps individuals understand their legal rights, AI-Assisted draft petitions, and collectively raise local issues with the appropriate authorities.

The platform combines a location-based petition system with a legal RAG pipeline that retrieves relevant laws, rights, and procedures to guide users through administrative and judicial processes.

---

## Core Idea

Many local issues remain unresolved because individuals do not know:

* Their legal rights
* The correct authority to contact
* The formal process to follow
* What to do if authorities ignore their requests

KAIRO addresses this by:

1. Providing legal guidance through a RAG-based system.
2. Allowing people in the same locality to collectively support petitions.
3. Assisting with escalation steps if authorities fail to respond.

---

## Key Features

### 1. Legal RAG Assistance

* Retrieves relevant laws, rights, and procedures from legal documents.
* Provides step-by-step guidance for legal and administrative actions.
* Helps users understand their options in simple terms.

### 2. Collective Petition System

* Users can create petitions related to local issues.
* Petitions are visible to people in the same geographic area.
* Multiple users can support the same petition to increase impact.

### 3. Authority Routing

* The system guides users to the correct authority based on the issue.
* Provides instructions for formal submission.

### 4. Judicial Escalation Guidance

If an authority ignores the petition:

* KAIRO provides the next legal steps.
* Suggests appropriate escalation paths.
* Explains procedures such as complaints, appeals, or legal notices.

### 5. Multilingual interface
* Focuses on regional language dashboard for better experience.
* Petition and assistance in your regional language.

---

## System Architecture

KAIRO uses a Retrieval-Augmented Generation (RAG) pipeline built with LangGraph.

### RAG Flow

1. **Query Input**
   User submits a legal question or petition-related query.

2. **Query Expansion**
   The system reformulates the query for better retrieval.

3. **Vector Retrieval**
   Relevant legal documents are fetched from the vector database.

4. **Relevance Filtering & Reranking**
   Only the most relevant legal content is selected.

5. **Answer Generation**
   A structured legal response is generated based on retrieved documents.

6. **Answer Refinement**
   The response is improved for clarity and completeness.

---

## Tech Stack

### Frontend & Server

* **Next.js**

  * Web interface
  * API routes
  * Petition system
  * Location-based access

### RAG & Backend Logic

* **LangGraph**

  * RAG pipeline orchestration
  * Multi-step legal query processing
* Vector database for legal document retrieval
* Document parsing and embedding pipeline

---

## Use Cases

* Understanding local civic rights
* Drafting and submitting petitions
* Community-driven issue escalation
* Learning legal steps after authority inaction

---