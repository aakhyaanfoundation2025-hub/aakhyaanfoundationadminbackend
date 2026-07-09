const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  // Local
  "http://127.0.0.1:5500",
  "http://localhost:5500",
  "http://127.0.0.1:5501",
  "http://localhost:5501",

  // Live
  "https://aakhyaanfoundation.org",
  "https://aakyanfoundationbackfrontend.vercel.app",
  "https://aakhyaanfoundation.vercel.app",
  "https://aakhyaanfoundationadminbackendfront.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Postman / server-to-server requests
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS Not Allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/donate", require("./routes/donateRoutes"));
app.use("/api/updates", require("./routes/updateRoutes"));
app.use("/api/admin-gallery", require("./routes/galleryAdminRoutes"));
app.use("/api/activity-calendar", require("./routes/activityCalendarRoutes"));
app.use("/api/admin-blog", require("./routes/blogAdminRoutes"));
app.use("/api/press-coverage", require("./routes/pressCoverageRoutes"));
app.use("/api/upcoming-events", require("./routes/upcomingEventRoutes"));
app.use("/api/documents", require("./routes/documentRoutes"));
app.use("/api/audit-documents", require("./routes/auditDocumentRoutes"));
app.use("/api/policy-documents", require("./routes/policyDocumentRoutes"));
app.use("/api/donors", require("./routes/donorRoutes"));
app.use("/api/members", require("./routes/memberRoutes"));

app.get("/", (req, res) => {
  res.send("Aakhyaan Foundation API is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});