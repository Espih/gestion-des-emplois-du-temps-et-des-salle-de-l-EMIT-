import { Card, CardContent, Typography, Box, Avatar } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

interface Comment {
  title: string;
  author: string;
  date: string;
}

const comments: Comment[] = [
  {
    title: "I'm really impressed with the new design of our website!",
    author: "John Doe",
    date: "January 1, 2023",
  },
  {
    title: "The new features are amazing! I can't wait to try them out.",
    author: "Jane Smith",
    date: "February 2, 2023",
  },
  {
    title: "Great job on the redesign! The colors are so vibrant and the layout is easy to navigate.",
    author: "Sarah Johnson",
    date: "March 3, 2023",
  },
  {
    title: "I love the new color scheme! It makes everything look so much better.",
    author: "Michael Brown",
    date: "April 4, 2023",
  },
  {
    title: "The new product line is a huge hit with customers.",
    author: "Emily Davis",
    date: "May 5, 2023",
  },
  {
    title: "The new website is so user-friendly.",
    author: "David Lee",
    date: "June 6, 2023",
  },
];

export default function RecentComments() {
  return (
    <Card sx={{ borderRadius: "12px", boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.05)", border: "1px solid #f3f4f6" }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: "semibold", color: "#020339", mb: 2 }}>
          Recent comments
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {comments.map((comment, idx) => (
            <Box
              key={idx}
              sx={{
                p: 2,
                borderRadius: "8px",
                transition: "all 0.2s",
                "&:hover": { backgroundColor: "#f9fafb" },
              }}
            >
              <Typography variant="body2" sx={{ color: "#374151", mb: 1, fontStyle: "italic" }}>
                "{comment.title}"
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar sx={{ width: 24, height: 24, bgcolor: "#94CCFB" }}>
                  <PersonIcon sx={{ fontSize: 14, color: "#020339" }} />
                </Avatar>
                <Typography variant="caption" sx={{ color: "#020339", fontWeight: 500 }}>
                  {comment.author}
                </Typography>
                <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                  •
                </Typography>
                <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                  {comment.date}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}