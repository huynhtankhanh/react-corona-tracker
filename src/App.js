import React, { useEffect, useMemo } from 'react';
import { sortBy } from 'lodash';
import CountrySelector from './components/CountrySelector';
import { getCountries, getReportByCountry } from './components/apis';
import Summary from './components/Summary';
import Highlight from './components/Highlight';
import { Container, Typography } from '@material-ui/core';
import '@fontsource/roboto';
import moment from 'moment';
import 'moment/locale/vi';
var _ = require('lodash');

moment.locale('en');

const App = () => {
  const [countries, setCountries] = React.useState([]);
  const [selectedCountryId, setSelectedCountryId] = React.useState('');
  const [report, setReport] = React.useState([]);

  useEffect(() => {
    getCountries().then((res) => {
      const { data } = res;
      const countries = sortBy(data, 'Country');
      setCountries(countries);
      setSelectedCountryId('vn');
    });
  }, []);

  const handleOnChange = React.useCallback((e) => {
    setSelectedCountryId(e.target.value);
  }, []);

  useEffect(() => {
    if (selectedCountryId) {
      const selectedCountry = countries.find(
        (country) => country.ISO2 === selectedCountryId.toUpperCase()
      );
      console.log("Selected Country=== " + JSON.stringify(selectedCountry));
      getReportByCountry(selectedCountry.Slug).then((res) => {
        //console.log('getReportByCountry', JSON.stringify(res.data));
        // remove last item = current date
        //res.data.pop();
        setReport(res.data);
      });
    }
  }, [selectedCountryId, countries]);

  const summary = useMemo(() => {
    //const maxRecovered = report.filter(i => console.log("aaa-" + Math.max(i.Recovered)));
    //const totalPrice = report. reduce((total, product) => total + product.Recovered, 0);
    // console.log("total=" + totalPrice);

    //const aaa = Math.max.apply(Math, report.map(function(o) { return o.Recovered; }))
    const maxRecoverReport = _.maxBy(report, function(o) { return o.Recovered; });

    if (report && report.length) {
      const latestData = report[report.length - 1];
      return [
        {
          title: 'Total infected',
          count: latestData.Confirmed,
          type: 'confirmed',
        },
        {
          title: 'Recovered',
          count: maxRecoverReport.Recovered,
          type: 'recovered',
        },
        {
          title: 'Death',
          count: latestData.Deaths,
          type: 'death',
        },
      ];
    }
    return [];
  }, [report]);

  return (
    <Container style={{ marginTop: 20 }}>
      <Typography variant='h2' component='h2'>
      COVID-19
      </Typography>
      <Typography>{moment().format('LLL')}</Typography>
      <CountrySelector
        handleOnChange={handleOnChange}
        countries={countries}
        value={selectedCountryId}
      />
      <Highlight summary={summary} />
      <Summary countryId={selectedCountryId} report={report} />
    </Container>
  );
};

export default App;