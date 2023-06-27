import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  item: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderLeftWidth: 5,
    borderLeftColor: '#007BFF',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  playerName: {
    fontSize: 30,
    color: 'black',
    textAlign: "center",
    marginTop: "5%",
    marginBottom: 20,
  },
  infoGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',

  },
  infoBox: {

    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 22,
    marginHorizontal: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    height: 105,
    width: 105,
  },
  infoBoxTitle: {
    alignSelf: 'flex-start', 
  },
  infoBoxValue: {
    alignSelf: 'flex-end',
    fontWeight: "bold" ,
    fontSize: 27,
  },
});

export default styles;
