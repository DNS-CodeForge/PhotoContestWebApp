import { Box, Rating, Typography } from "@mui/material";

export default function ReviewCard ({review}) {
    return (
        <Box display={"flex"} flexDirection={"column"} padding={'1rem'} boxShadow={"2px 2px 5px rgba(255, 165, 0, 0.5)"} marginTop={"1rem"}>
          <Typography component="legend">Rating</Typography>
          <Rating name="read-only" readOnly defaultValue={review.score} max={10} size="large"/>
          <Typography variant="h4"> Comment: {review.comment}</Typography>
          <Typography variant="h5"> Category mismatch: {review.categoryMismatch.toString()}</Typography>
        </Box>
    );
}
