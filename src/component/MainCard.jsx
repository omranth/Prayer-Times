import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

function MainCard({ img, name, time }) {
  return (
    <Card sx={{ maxWidth: 345, width: '345px' }}>
      <CardActionArea>
        <CardMedia component="img" height="190" image={img} alt="green iguana" />
        <CardContent>
          <Typography gutterBottom variant="h4" component="div">
            {name}
          </Typography>
          <Typography variant="h2" color="text.secondary">
            {time}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default MainCard;
