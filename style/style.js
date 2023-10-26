import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  header: {
    marginTop: 30,
    marginBottom: 15,
    backgroundColor: 'darksalmon',
    flexDirection: 'row',
  },
  footer: {
    marginTop: 10,
    backgroundColor: 'darksalmon',
    flexDirection: 'row'
  },
  input: {
    borderColor: 'darkred',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 5,
    width: 250,
    margin: 5
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    flex: 1,
    fontSize: 23,
    textAlign: 'center',
    margin: 10,
  },
  author: {
    color: '#fff',
    fontWeight: 'bold',
    flex: 1,
    fontSize: 15,
    textAlign: 'center',
    margin: 10,
  },
  gameboard: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  gameinfo: {
    backgroundColor: '#fff',
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 15,
    marginTop: 10,
    margin: 10
  },
  row: {
    marginTop: 20,
    padding: 10
  },
  flex: {
    flexDirection: "row"
  },
  button: {
    margin: 30,
    flexDirection: "row",
    padding: 10,
    backgroundColor: "darkred",
    width: 150,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  infologo: {
    alignSelf: 'center'
  },
  boldtext: {
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 18,
    marginTop: 10,
    margin: 10,
    fontWeight: 'bold'
  },
  bluebutton: {
    backgroundColor: "darkred",
    alignItems: 'center',
    alignSelf: 'center',
    margin: 30,
    padding: 15,
    width: 200,
    borderRadius: 15,
    justifyContent: 'center',
  },
  buttontext: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  marginBottom: {
    marginBottom: 10
  }
})

export {styles};