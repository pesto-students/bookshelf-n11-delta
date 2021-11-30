import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

export function Overlay({ showBackdrop }) {
  if (!!showBackdrop) {
    return (
      <Backdrop
        sx={{ color: "#3f51b5", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }
  return <CircularProgress color="primary" />;
}
