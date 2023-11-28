import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Pressable,
  TextInput,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';

type TableData = {
  first: number;
  offset: number;
  records: any[];
  disableNext: boolean;
  disablePrev: boolean;
};

type CSVDataTableProps = {
  tableData: TableData;
  onPageChange: (rowsPerPage: number) => void;
  csvData: any[];
  onNext: () => void;
  onPrev: () => void;
};

const CSVDataTable = ({
  tableData,
  onPageChange,
  csvData,
  onNext,
  onPrev,
}: CSVDataTableProps) => {
  const [editedData, setEditedData] = useState({});

  const headers =
    tableData?.records?.length > 0 ? Object.keys(tableData?.records[0]) : [];

  const handleEditChange = (rowData: any, cellData: unknown, value: string) => {
    setEditedData(prevData => ({
      ...prevData,
      [`${rowData}-${cellData}`]: value,
    }));
  };

  const renderRow = ({item, index}: {item: any; index: number}) => (
    <View
      style={[
        styles.rowContainer,
        index % 2 === 0 ? styles.evenRow : styles.oddRow,
      ]}>
      {Object.values(item).map((cellData, cellIndex) => (
        <View key={cellIndex} style={styles.cellContainer}>
          <TextInput
            style={styles.cell}
            // @ts-ignore
            value={editedData[`${item}-${cellData}`] || cellData}
            onChangeText={text => handleEditChange(item, cellData, text)}
            multiline
          />
        </View>
      ))}
    </View>
  );

  return (
    <ScrollView nestedScrollEnabled style={styles.container}>
      <Text style={styles.title}>Stealth 🚀</Text>
      <ScrollView horizontal>
        <FlatList
          data={tableData.records || []}
          renderItem={renderRow}
          keyExtractor={(item, index) => index.toString()}
          // eslint-disable-next-line react/no-unstable-nested-components
          ListHeaderComponent={() => (
            <View style={styles.headerRow}>
              {headers.map((headerCell, index) => (
                <View key={index} style={styles.headerContainer}>
                  <Text style={styles.headerText}>{headerCell}</Text>
                </View>
              ))}
            </View>
          )}
        />
      </ScrollView>
      <View style={styles.footerContainer}>
        <View style={styles.paginationSection}>
          <Pressable onPress={onPrev} disabled={tableData.disablePrev}>
            <Text style={styles.pageNaviagation}> {'‹ '} </Text>
          </Pressable>
          <Text style={styles.pageDetails}>
            {tableData.offset + 1} - {tableData.first + tableData.offset} of{' '}
            {csvData.length}
          </Text>
          <Pressable onPress={onNext} disabled={tableData.disableNext}>
            <Text style={styles.pageNaviagation}> {' ›'} </Text>
          </Pressable>
        </View>
        <View style={{flex: 0.3}}>
          <Picker
            style={styles.picker}
            selectedValue={tableData.first}
            onValueChange={itemValue => onPageChange(itemValue)}>
            <Picker.Item label="5" value={5} />
            <Picker.Item label="10" value={10} />
            <Picker.Item label="20" value={20} />
          </Picker>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  title: {
    color: '#000',
    alignSelf: 'center',
    justifyContent: 'center',
    fontSize: 20,
    paddingVertical: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderColor: '#67bada',
  },
  evenRow: {
    backgroundColor: '#f9f9f9',
  },
  oddRow: {
    backgroundColor: '#c9e4e4',
  },
  headerContainer: {
    margin: 10,
    borderColor: '#67bada',
    width: 140,
    flex: 1,
  },
  cellContainer: {
    padding: 5,
    borderColor: '#67bada',
    width: 180,
    flex: 1,
    borderRightWidth: 1,
  },
  cell: {
    marginLeft: 10,
    textAlign: 'center',
    color: '#033f45',
    fontSize: 14,
  },
  headerRow: {
    backgroundColor: '#4ab9c4',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  headerText: {
    fontWeight: '600',
    color: '#f9f9f9',
    textAlign: 'center',
    paddingLeft: 10,
  },
  footerContainer: {
    marginVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    color: 'yellow',
    fontSize: 12,
  },
  pageNaviagation: {
    color: '#67bada',
    fontSize: 30,
    fontWeight: '900',
  },
  paginationSection: {flex: 0.7, alignItems: 'center', flexDirection: 'row'},
  pageDetails: {
    color: '#67bada',
    fontSize: 15,
    top: 5,
  },
  picker: {
    color: '#67bada',
    padding: 8,
    fontSize: 12,
  },
});

export default CSVDataTable;
