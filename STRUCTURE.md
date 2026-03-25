# Repository Structure

```
Python-based-Campus-Second-hand-Book-Trading-Platform-ECUST/
│
├── backend/                          # Python FastAPI Backend
│   ├── app/                         # Main application package
│   │   ├── api/                     # API routes/endpoints
│   │   ├── models/                  # SQLAlchemy ORM models
│   │   ├── schemas/                 # Pydantic validation schemas
│   │   ├── services/                # Business logic layer
│   │   └── database/                # Database configuration
│   ├── main.py                      # FastAPI app entry point
│   ├── requirements.txt             # Python dependencies
│   ├── .env.example                 # Environment variables template
│   └── .gitignore                   # Git ignore rules
│
├── frontend/                         # React + TypeScript Frontend
│   ├── public/                      # Static public assets
│   ├── src/                         # TypeScript/React source code
│   │   ├── components/              # Reusable React components
│   │   ├── pages/                   # Page components
│   │   ├── services/                # API service clients
│   │   ├── types/                   # TypeScript type definitions
│   ├── package.json                 # npm dependencies & scripts
│   ├── tsconfig.json                # TypeScript configuration
│   ├── .gitignore                   # Git ignore rules
│   └── .env.example                 # Environment variables template
│
├── .gitignore                        # Root-level git ignore
├── LICENSE                          # Project license
├── README.md                        # Project documentation
└── STRUCTURE.md                     # Repository structure
```