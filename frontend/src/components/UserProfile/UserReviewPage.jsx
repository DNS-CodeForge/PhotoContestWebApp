import { Box } from "@mui/material";
import ReviewCard from "./ReviewCard";

export default function UserReviewPage ({reviews}) {
    return (
        <Box padding={"1rem"} margin={"0.5rem"}>
        <section>
            <ul>
                {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                ))}
            </ul>
            
        </section>
        </Box>
    );
}
