import { StyleSheet, Platform, StatusBar } from 'react-native'

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  input: {
    height: 40,
    marginBottom: 12,
    borderWidth: 1,
    padding: 10
  },
  h1: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  paragraph: {
    fontSize: 18
  },
  boldParagraph: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  alignCenterRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  borderBottom: {borderBottomColor: 'black', borderBottomWidth: 1},
  listHeader: {flex: 1, marginLeft: 10, marginRight: 10, marginTop: 10, zIndex: 2},
  listContainer: {flex: 5, marginLeft: 10, marginRight: 10, marginTop: 20},
  detailHeader: {flex: 1, padding: 5},
  detailContainer: {height: '50%', borderColor: 'black', borderRadius: 5, borderWidth: 1},
  detailPage: {flex: 1, margin: 10, justifyContent: 'center'}
});