import React from 'react'
import { useObserver } from 'mobx-react-lite'
import { useParams } from 'react-router-dom'

import {
  Typography, 
  Grid
} from '@material-ui/core'
import Plot from 'react-plotly.js'

import LoadingOverlay from 'components/LoadingOverlay'
import Snackbar from 'components/SnackbarAlert'
import { useStore } from 'index'
import useStyles from './styles'

const CamDetail: React.FC = () => {
  const { cam: camStore } = useStore()
  const { camId } = useParams()
  const classes = useStyles()
  const [isSnackOpen, setIsSnackOpen] = React.useState(false)

  const handleSnackClose = (event: any, reason: string = 'clickaway') => {
    camStore.clearState()
    setIsSnackOpen(false)
  }

  React.useEffect(() => {
    camStore.getCam(camId)
    camStore.listRecords(camId)
    let id = setInterval(() => camStore.listRecords(camId), 5000);

    return () => clearInterval(id);

    // eslint-disable-next-line
  }, [ camId ])

  React.useEffect(() => {
    if (camStore.message.length > 0) {
      setIsSnackOpen(true)
    }

    // eslint-disable-next-line
  }, [camStore.message])

  const layoutChart = {
    title: 'Porcetaje de personas incumpliendo distanciamiento',
    autosize:true,
  }

  return useObserver( () => (
    <>
      { camStore.instance &&
        <Grid container spacing={2}>
          <Grid item md={6}>
            <Typography variant="h4" component="h4" gutterBottom>
              Cámara: {camStore.instance.name}
            </Typography>
            <img src={camStore.instance.image_stream} alt="streaming doesn't working"/>
          </Grid>
          <Grid item md={6}>
            <Plot
              className={classes.plot}
              data={camStore.plotDetailBreakingPercent}
              layout={layoutChart}
              useResizeHandler
            />
          </Grid>
        </Grid>
      }

      <LoadingOverlay pending={camStore.stateIsPending}/>
      <Snackbar
        open={isSnackOpen}
        autoHideDuration={1000}
        onClose={handleSnackClose}
        severity={camStore.isErrorMessage ? 'error' : 'success'}
        message={camStore.message}
      />
    </>
  ))
}

export default CamDetail
