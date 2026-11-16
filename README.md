# InterviewPrep

> An AI-assisted interview preparation and assessment platform for candidates, HR teams, and administrators.

**Live demo:** Add your deployed frontend URL here

InterviewPrep helps candidates prepare for technical interviews, complete aptitude and camera-based interview rounds, and review their performance. Companies can register openings and HR teams can review candidate interview history from a dedicated dashboard.

## Features

### Candidate experience

- Browse approved company and interview opportunities.
- Create an account, sign in, and manage a profile.
- Practice technical questions by subject, including Python, Java, JavaScript, React, SQL, DBMS, DSA, HTML, CSS, operating systems, networking, and OOP.
- Complete aptitude assessments before starting a camera interview.
- Record spoken answers using the browser microphone.
- Receive answer evaluation using:
  - Speech-to-text transcription.
  - Semantic similarity against reference answers.
  - Audio clarity, pace, and confidence signals.
  - Facial-expression analysis with DeepFace.
- Upload a resume and receive an automated resume analysis.
- View previous interview attempts and results.

### HR and administrator experience

- Register and manage company profiles, logos, job details, skills, benefits, and contact information.
- Approve, reject, and delete company listings.
- Sign in as HR and review candidate interview history.
- View candidate scores, pass/fail results, round type, attempt number, and answer-level analysis.

## Technology stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 18, React Router, Axios, Bootstrap, Tailwind CSS, Framer Motion |
| Backend | Python, Django 4.2, Django REST Framework |
| Database | SQLite by default; PostgreSQL supported through `DATABASE_URL` |
| AI and analysis | DeepFace, OpenCV, scikit-learn, Sentence Transformers, NLTK, TextBlob |
| Audio and documents | SpeechRecognition, PyDub, librosa, PyPDF2, docx2txt |
| Deployment support | Gunicorn, WhiteNoise, `dj-database-url` |


## Local setup

### Prerequisites

- Python 3.10+ recommended
- Node.js 18+ and npm
- A browser with microphone and camera permissions for interview rounds

### 1. Start the Django API

From the `interview_backend` directory:

```bash
python -m venv .venv

# Windows PowerShell
.venv\Scripts\Activate.ps1

# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The API is available at `http://127.0.0.1:8000`.

### 2. Start the React frontend

Open a second terminal and run:

```bash
cd op-1
npm install
npm start
```

The frontend is available at `http://localhost:3000`. The development proxy forwards API requests to Django on port `8000`.

## Configuration

Before deploying, move secrets and environment-specific values out of source code. At minimum, configure:

```env
DJANGO_SECRET_KEY=replace-with-a-long-random-secret
DEBUG=False
DATABASE_URL=postgresql://user:password@host:5432/database
```

The backend currently uses SQLite when `DATABASE_URL` is not set. For production, PostgreSQL is recommended. Configure SMTP credentials through environment variables if email notifications are enabled.

For a separately hosted frontend, set the API base URL used by the React application and add the deployed frontend origin to Django `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS`.

## Useful API routes

All routes are served by the Django application:

| Route | Purpose |
| --- | --- |
| `POST /api/signup/` | Create a candidate account |
| `POST /api/login/` | Candidate login |
| `POST /api/hr/login/` | HR login |
| `GET /api/company/approved/` | Retrieve approved companies |
| `GET /api/subject-questions/` | Retrieve subject-based interview questions |
| `GET /api/aptitude-questions/` | Retrieve aptitude questions |
| `POST /api/evaluate-aptitude/` | Evaluate an aptitude answer |
| `POST /api/analyze-audio/` | Analyze uploaded interview audio |
| `POST /api/ai/expression/` | Analyze a submitted face frame |
| `POST /api/resume-scan/` | Extract and analyze resume content |
| `GET /api/my-interviews/` | Retrieve the candidate's interview history |
| `GET /api/hr/interview-history/` | Retrieve company interview history |

See [`interview/urls.py`](interview_backend/interview/urls.py) for the complete route list.

## AI analysis notes

- Speech transcription uses the Google Web Speech API through the `SpeechRecognition` package, so transcription requires internet access.
- Camera and microphone analysis requires explicit browser permissions and works best in a secure context such as HTTPS when deployed.
- Large ML dependencies can make the first installation and first model load slow.
- AI scores are decision-support signals, not a substitute for human hiring judgment.
- Do not upload sensitive candidate data to an environment that has not been configured with appropriate privacy and retention controls.

## Testing

Run the backend setup checks from `interview_backend`:

```bash
python test_ml_setup.py
```

With the Django server running, check the facial-expression endpoint:

```bash
python ..\test_face_expression.py
```

Run the frontend test command from `op-1`:

```bash
npm test
```

## Production checklist

- Set a strong `DJANGO_SECRET_KEY`.
- Set `DEBUG=False`.
- Replace wildcard hosts and CORS settings with an explicit allowlist.
- Configure PostgreSQL and run migrations.
- Configure persistent media storage for resumes, profile pictures, and company logos.
- Run `python manage.py collectstatic`.
- Serve Django with Gunicorn behind HTTPS.
- Configure secure, rotated SMTP credentials through environment variables.
- Review authentication, CSRF, upload validation, rate limiting, and data-retention policies before collecting real candidate data.

## Contributing

1. Create a feature branch.
2. Keep frontend and backend changes focused and documented.
3. Run the relevant tests before opening a pull request.
4. Do not commit credentials, uploaded media, database files, or model caches.

## License

No license has been specified yet. Add a `LICENSE` file before distributing this project publicly.
