export interface GenericDialogProps {
  open: boolean;
  title: string;
  onDialogClose: () => void;
  [key: string]: any;
}
