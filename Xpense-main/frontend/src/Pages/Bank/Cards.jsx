import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red, green, blue, orange, purple } from '@mui/material/colors';
import { Box } from "@mui/material";
import LinearProgress from '@mui/material/LinearProgress';
import EditNoteSharpIcon from '@mui/icons-material/EditNoteSharp';
import DeleteForeverSharpIcon from '@mui/icons-material/DeleteForeverSharp';

const colors = [red[500], green[500], blue[500], orange[500], purple[500]];

function getAvatarColor(name) {
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export default function Cards(props) {
  const utilizationPercentage = (props.limitUtilised / props.budget) * 100;
  const utilizationMessage = utilizationPercentage > 80 
    ? "Warning: Budget Nearly Exceeded" 
    : `Remaining Budget: ${props.budget - props.limitUtilised}`;

  return (
    <Card sx={{
    //   marginBottom: "20px",
      marginLeft: "5%",
      marginRight: "5%",
      marginTop :"10px",
      marginBottom:"10px",
      padding: "5px",
      borderRadius: "8px",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: getAvatarColor(props.name), fontSize: '1.1rem' }} aria-label="recipe">
            {props.name[0].toUpperCase()}
          </Avatar>
        }
        action={
          props.budget && (
            <Box sx={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#333' }}>
              {props.limitUtilised}/{props.budget}
            </Box>
          )
        }
        title={
          <Typography variant="body1" noWrap sx={{ maxWidth: 160, fontWeight: 'bold' }}>
            {props.name}
          </Typography>
        }
        subheader={props.budget ? `Budget: ${props.budget}` : "No Budget set"}
      />

      <CardContent sx={{ paddingTop: 0 }}>
        {props.budget ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
           
              <LinearProgress
                variant="determinate"
                value={utilizationPercentage > 100 ? 100 : utilizationPercentage}
                sx={{
                  width: "90%",
                  height: "8px",
                  backgroundColor: '#eeeeee',
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: utilizationPercentage > 80 ? 'red' : 'green'
                  },
                }}
              />
               <Typography
                variant="body2"
                sx={{ fontWeight: 'bold', color: utilizationPercentage > 80 ? 'error.main' : 'text.secondary', marginLeft: '8px' }}
              >
                {utilizationPercentage.toFixed(0)}%
              </Typography>
            </Box>
            <Typography
              variant="body2"
              color={utilizationPercentage > 80 ? 'error' : 'textSecondary'}
              sx={{ fontWeight: 'bold' }}
            >
              {utilizationMessage}
            </Typography>
          </>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No budget set for this category. Click on Edit to add budget
          </Typography>
        )}
      </CardContent>

      <CardActions disableSpacing sx={{ justifyContent: 'space-between', padding: '0 8px' }}>
        <IconButton aria-label="edit" sx={{ color: 'black', fontSize: '1.2rem' }}>
          <EditNoteSharpIcon onClick={props.handleEditCategory} />
        </IconButton>
        <IconButton aria-label="delete" sx={{ color: 'red', fontSize: '1.2rem' }}>
          <DeleteForeverSharpIcon onClick={props.handleDeleteCategory} />
        </IconButton>
      </CardActions>
    </Card>
  );
}
