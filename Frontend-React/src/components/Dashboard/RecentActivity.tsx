import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

interface Activity {
  date: string;
  category: string;
  amount: number;
}

const activities: Activity[] = [
  { date: "Jan 01", category: "Clothing", amount: 100 },
  { date: "Jan 02", category: "Electronics", amount: 150 },
  { date: "Jan 03", category: "Home Appliances", amount: 200 },
  { date: "Jan 04", category: "Books", amount: 250 },
  { date: "Jan 05", category: "Toys", amount: 300 },
  { date: "Jan 06", category: "Fashion", amount: 350 },
  { date: "Jan 07", category: "Jewelry", amount: 400 },
  { date: "Jan 08", category: "Accessories", amount: 450 },
  { date: "Jan 09", category: "Sports", amount: 500 },
  { date: "Jan 10", category: "Travel", amount: 550 },
  { date: "Jan 11", category: "Beauty", amount: 600 },
  { date: "Jan 12", category: "Groceries", amount: 650 },
  { date: "Jan 13", category: "Pet Supplies", amount: 700 },
  { date: "Jan 14", category: "Cleaning Products", amount: 750 },
  { date: "Jan 15", category: "Personal Care", amount: 800 },
  { date: "Jan 16", category: "Health & Wellness", amount: 850 },
  { date: "Jan 17", category: "Home Decor", amount: 900 },
  { date: "Jan 18", category: "Furniture", amount: 950 },
  { date: "Jan 19", category: "Kitchenware", amount: 1000 },
];

export default function RecentActivity() {
  return (
    <Card sx={{ borderRadius: "12px", boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.05)", border: "1px solid #f3f4f6" }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: "semibold", color: "#020339", mb: 2 }}>
          Recent activity
        </Typography>
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "semibold", color: "#6b7280" }}>Date</TableCell>
                <TableCell sx={{ fontWeight: "semibold", color: "#6b7280" }}>Category</TableCell>
                <TableCell align="right" sx={{ fontWeight: "semibold", color: "#6b7280" }}>
                  Amount
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activities.map((activity, idx) => (
                <TableRow key={idx} sx={{ "&:hover": { backgroundColor: "#f9fafb" } }}>
                  <TableCell sx={{ color: "#374151" }}>{activity.date}</TableCell>
                  <TableCell sx={{ color: "#374151" }}>{activity.category}</TableCell>
                  <TableCell align="right" sx={{ color: "#374151", fontWeight: 500 }}>
                    ${activity.amount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}