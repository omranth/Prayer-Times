import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

import MainCard from './MainCard';
// import { MainCard } from './index';

import './mainContent.css';
import { Box, Container, Grid } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { getNames } from 'country-list';
import { getCities } from 'countries-cities';
import moment from 'moment';
import 'moment/dist/locale/ar-dz';
moment.locale('ar');

import img1 from '../assets/pexels-davidmceachan-87500.jpg';
import img2 from '../assets/pexels-ibnulharezmi-7055491.jpg';
import img3 from '../assets/pexels-naderaymanphotography-13846410.jpg';
import img4 from '../assets/pexels-davidmceachan-87500.jpg';
import img5 from '../assets/pexels-ibnulharezmi-7055491.jpg';

export default function MainContent() {
  const [country, setCountry] = useState('');
  const [citiesList, setCitiesList] = useState([]); // جميع المحافظات
  const [city, setCity] = useState(''); // اختيار المحافظة
  const [today, setToday] = useState(moment().format('MMMM Do YYYY || HH:mm:ss'));
  const [salah, setSalah] = useState('');
  const [fomatTime, setFormatTime] = useState('');
  const [prayerTimes, setPrayerTimes] = useState({
    Fajr: '04:09',
    Sunrise: '05:40',
    Dhuhr: '12:42',
    Asr: '16:25',
    Maghrib: '19:43',
    Isha: '20:50',
  });

  const stateTime = () => {
    let interval = setInterval(() => {
      const timeNow = moment();

      let targetTime = null;

      for (const key in prayerTimes) {
        const element = prayerTimes[key];
        if (timeNow.isBefore(moment(element, 'HH:mm'))) {
          targetTime = moment(prayerTimes[key], 'HH:mm');
          setSalah(key);
          break;
        }
      }
      if (!targetTime) {
        targetTime = moment(prayerTimes['Fajr'], 'HH:mm');
        setSalah('Fajr');
      }

      const timeDifference = moment.duration(targetTime.diff(timeNow));
      const formattedTimeDifference = ` ${timeDifference.hours()}: ${timeDifference.minutes()} : ${timeDifference.seconds()} `;
      setFormatTime(formattedTimeDifference);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  };

  useEffect(() => {
    stateTime();
  }, [city, country]);

  const countryList = getNames();
  const countries = countryList.map((country) => ({
    value: country,
    name: country,
    key: country,
  }));

  useEffect(() => {
    if (country) {
      const countryCities = getCities(country) || [];
      setCitiesList(countryCities);
      setCity(countryCities[0]); // Reset city when country changes
    }
  }, [country]);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      if (city && country) {
        try {
          const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}`);
          const data = await response.json();
          if (data.code === 200) {
            setPrayerTimes(data.data.timings);
          } else {
            console.error('Error fetching prayer times:', data);
          }
        } catch (error) {
          console.error('Error fetching prayer times:', error);
        }
      }
    };

    fetchPrayerTimes();
  }, [city, country]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentDate = moment().format('MMMM Do YYYY || HH:mm:ss');
      setToday(currentDate);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  return (
    <Container
      sx={{
        maxWidth: {
          xs: '100%',
          sm: '600px',
          md: '960px',
          lg: '1280px',
          xl: '1920px',
        },
      }}
    >
      <Grid
        container
        sx={{
          display: 'flex',
          justifyContent: 'start',
          alignItems: 'center',
          marginBottom: '30px',
        }}
      >
        <Grid
          item
          sx={{
            backgroundColor: '#f1faee1f',
            padding: '10px',
          }}
          xs={12}
          sm={8}
          md={6}
          lg={8}
          xl={12}
        >
          <div style={{ backgroundColor: '#f1faee1f', padding: '10px' }}>
            <h2>{today}</h2>
            <h1>{`${country} || ${city}`}</h1>
          </div>
        </Grid>

        <Grid
          className=""
          item
          xs={12}
          sm={4}
          md={6}
          lg={4}
          xl={12}
          sx={{
            backgroundColor: '#f1faee1f',
            padding: '10px',
            '@media (max-width:600px)': {
              color: 'white ',
              padding: '10px',
            },
          }}
        >
          <div
            style={{
              backgroundColor: '#f1faee1f',
              padding: '10px',
            }}
          >
            <h2>متبقي حتى صلاة {salah}</h2>
            <h1>{fomatTime}</h1>
          </div>
        </Grid>
      </Grid>
      <Divider style={{ borderColor: 'white', opacity: '0.1' }} />

      <Box
        className="boxImage"
        sx={{
          padding: '10px',
          borderRadius: '10px',
          backgroundColor: '#f1faee1f',
          marginTop: '30px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <MainCard img={img1} name="الفجر" time={prayerTimes.Fajr} />
        <MainCard img={img1} name="الشروق" time={prayerTimes.Sunrise} />
        <MainCard img={img2} name="الظهر" time={prayerTimes.Dhuhr} />
        <MainCard img={img3} name="العصر" time={prayerTimes.Asr} />
        <MainCard img={img4} name="المغرب" time={prayerTimes.Maghrib} />
        <MainCard img={img5} name="العشاء" time={prayerTimes.Isha} />
      </Box>

      <Stack
        sx={{
          backgroundColor: '#f1faee1f',
          padding: '10px',
          borderRadius: '10px',
        }}
        direction="row"
        justifyContent={'center'}
        style={{ marginTop: '25px' }}
      >
        <Box sx={{ minWidth: 120, marginLeft: '20px', color: 'white' }}>
          <FormControl sx={{ minWidth: 120, color: 'white' }} fullWidth>
            <InputLabel id="country-select-label">Country</InputLabel>
            <Select sx={{ color: 'white' }} labelId="country-select-label" id="country-select" value={country} label="Country" onChange={handleCountryChange}>
              {countries.map((country) => (
                <MenuItem key={country.key} value={country.value}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ minWidth: 120, marginLeft: '20px' }}>
          <FormControl sx={{ minWidth: 120 }} fullWidth>
            <InputLabel id="city-select-label">City</InputLabel>
            <Select sx={{ color: 'white' }} labelId="city-select-label" id="city-select" value={city} label="City" onChange={handleCityChange}>
              {citiesList.map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Stack>
    </Container>
  );
}
