import Pagination from '@mui/material/Pagination';
import Box from '@mui/material/Box';
import styles from './Pagination.module.css'

export default function name({ count, page, onPageChange }) {
    return (
      <Box  justifyContent={"center"} alignItems={"center"} display={"flex"} sx={{marginBottom: "1rem", marginTop: '1.3rem'}}>
          <Pagination 
        count={count}
        page={page}
        onChange={onPageChange}
        className={styles.pagination}  sx={{
        "& .MuiPaginationItem-root:not(.Mui-selected):hover": {
          backgroundColor: "rgba(57, 62, 70, 0.6)", 
        },
        "& .Mui-selected": {
          backgroundColor: "rgb(57, 62, 70) !important",
          color: "#fff", 
        }
      }}    
        />
      </Box>
    )
}
