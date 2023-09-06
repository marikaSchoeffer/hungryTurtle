import { Alert } from "@mui/material";
import { styled } from "@mui/system";

export const primaryColor = "#f705cb";
export const pageSize = 9;
export const StyledAlert = styled(Alert)(({ theme }) => ({
  backgroundColor: "#fcecfc",
  borderColor: primaryColor,
}));
