/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useReducer, useState} from 'react';
import {SafeAreaView} from 'react-native';
import CSVDataTable from './CSVDataTable';

const parseCSV = (csvText: string) => {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',');
  const parsedData: Record<string, string | number | null>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].split(',');
    if (currentLine.length === headers.length) {
      const row = {};
      for (let j = 0; j < headers.length; j++) {
        // @ts-ignore
        row[headers[j].trim()] = currentLine[j].trim();
      }
      parsedData.push(row);
    }
  }
  return parsedData;
};

function App(): JSX.Element {
  const [csvData, setCsvData] = useState<unknown[]>([]);
  const [tableData, setTableData] = useReducer(
    (prev: any, next: any) => {
      const newEvent = {...prev, ...next};

      if (newEvent.records.length > newEvent.first) {
        newEvent.disableNext = true;
      }
      if (newEvent.offset > newEvent.first) {
        newEvent.disablePrev = false;
      }
      if (newEvent.records.length < newEvent.first) {
        newEvent.disableNext = false;
      }
      if (newEvent.offset < newEvent.first) {
        newEvent.disablePrev = true;
      }

      return newEvent;
    },
    {
      first: 5,
      offset: 0,
      records: [],
      disableNext: true,
      disablePrev: true,
    },
  );

  useEffect(() => {
    const url =
      'https://pkgstore.datahub.io/core/nyse-other-listings/other-listed_csv/data/9f38660d84fe6ba786a4444b815b3b80/other-listed_csv.csv';
    fetch(url)
      .then(response => response.text())
      .then(data => {
        setCsvData(parseCSV(data) as unknown[]);
      })
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    setTableData({
      records: csvData.slice(
        tableData.offset || 0,
        tableData.first + tableData.offset,
      ),
    });
  }, [csvData, tableData.offset, tableData.first]);

  const onPrev = () => {
    setTableData({
      offset: tableData.offset - tableData.first,
    });
  };
  const onNext = () => {
    setTableData({
      offset: tableData.first + tableData.offset || 0,
    });
  };

  const onPageChange = (rowsPerPage: number) => {
    setTableData({
      first: rowsPerPage,
      offset: tableData.first - tableData.offset || 0,
    });
  };

  return (
    <SafeAreaView style={{backgroundColor: 'white'}}>
      <CSVDataTable
        tableData={tableData}
        onPrev={onPrev}
        onNext={onNext}
        onPageChange={onPageChange}
        csvData={csvData}
      />
    </SafeAreaView>
  );
}

export default App;
