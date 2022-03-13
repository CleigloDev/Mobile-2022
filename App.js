import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { FlatList, Text, View, TouchableOpacity, SafeAreaView, TextInput, Button } from "react-native";
import { fetchUsersPage } from "./services/users";
import { basic } from "./theme";

/*

  Di seguito alcuni spunti per delle migliorie:
    - Inserire la navigazione tra una pagina e l'altra(es. lista pagina di dettaglio), magari con react-navigation
    - Strutturare diversamente il file App.js, in maniera tale che importi i vari componenti e non definirli tutti in un unico file
    - Eventualmente ridurre il numero di useState, per evitare eccessivi refresh della pagina, 
      si potrebbe pensare di raggrupparne alcuni in un unico oggetto
    - Scomporre il più possibile i componenti, in maniera da avere dei componenti riutilizzabili ove necessario ed evitare
    - Gestione della tastiera per ridurre eventuali problemi durante la ricerca per email

*/

export default function App() {
  return (
    <SafeAreaView style={basic.safeArea}>
      <StatusBar style="auto" />
      <Users />
    </SafeAreaView>
  );
};

const Users = () => {
  const [data, setData] = useState([]);
  const [user, setUserSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [email, setEmail] = useState("");
  const [sortData, setSortData] = useState("");

  useEffect(() => {
    _fetchData();
  }, []);

  const _fetchData = async () => {
    try {
      let response = await fetchUsersPage(page);
      
      setData([...data, ...response.Users]);
      setPage(page+1);
    } catch (e) {
      alert(`Errore:\nCaricamento dati fallito con: ${e}`);
    }
  };

  const _renderItemList = ({ item: user }) => {
    return (<UserListItem user={user} showDetail={() => {setUserSelected(user)}} />)
  };

  const _defineDataMapping = () => {
    let dataMapped = data;
    if(!!sortData){
      dataMapped = dataMapped.sort((firstUser, secondUser) => {
        if(sortData === 'email') return firstUser.email.localeCompare(secondUser.email);

        return firstUser.username.localeCompare(secondUser.username);
      });
    }

    if(!!email) {
      dataMapped = dataMapped.filter((user) => {
        return user.email.toLowerCase().search(email.toLowerCase()) !== -1;
      });
    }

    return dataMapped;
  };

  return (
    <>
      {!user ? 
        <>
          <View style={{...basic.listHeader}}>
            <TextInput
              style={basic.input}
              onChangeText={setEmail}
              value={email}
              placeholder="Cerca Email"
              keyboardType='email-address'
            />
            <View style={basic.alignCenterRow}>
              <TouchableOpacity onPress={() => {setSortData('email')}}>
                <Text style={basic.paragraph}>Ordina per email</Text>
              </TouchableOpacity>
              {sortData === 'email' ? 
                <Button onPress={() => {setSortData('')}} title="Annulla"/>
              : null}
            </View>
            <View style={{...basic.alignCenterRow}}>
              <TouchableOpacity onPress={() => {setSortData('username')}}>
                <Text style={basic.paragraph}>Ordina per username</Text>
              </TouchableOpacity>
              {sortData === 'username' ? 
                <Button onPress={() => {setSortData('')}} title="Annulla"/>
              : null}
            </View>
          </View>
          <View style={basic.listContainer}>
            <FlatList
              data={_defineDataMapping()}
              renderItem={_renderItemList}
              keyExtractor={item => item.id}
              onEndReached={_fetchData}
              onEndReachedThreshold={0.5}
              removeClippedSubviews={true}
            />
          </View>
        </>
      : <UserDetail user={user} hideDetail={() => {setUserSelected(null)}}/> }
    </>
  );
};

function UserListItem({ user, showDetail }) {

  const _showDefaultPaymentMethod = () => {
    const paymentDefault = user.PaymentMethods.find((method) => {
      return method.default;
    });

    return paymentDefault?.name;
  };

  const render = () => (
    <View style={{paddingTop: 10}}>
      <Text style={basic.paragraph}>Username: {user.username}</Text>
      <Text style={basic.paragraph}>Email: {user.email}</Text>
      <Text style={basic.paragraph}>Metodo di pagamento: {_showDefaultPaymentMethod()}</Text>
      <View style={{flexDirection: 'row-reverse', marginTop: 10}}>
        <Button title="Dettagli" onPress={showDetail} />
      </View>
    </View>
  );


  return render();
};

function UserDetail({ user, hideDetail }) {

  const _renderItemList = ({ item: paymentMethod }) => {
    return (
      <View style={{margin: 10}}>
        <Text>
          Nome: {paymentMethod.name}
        </Text>
        <Text>
          Divisa: {paymentMethod.currency}
        </Text>
        <Text>
          Default: {paymentMethod.default ? 'Si' : 'No'}
        </Text>
      </View>
    )
  }

  const render = () => (
    <View style={basic.detailPage}>
      <View style={basic.detailContainer}>
        <View style={{...basic.detailHeader, ...basic.alignCenterRow, ...basic.borderBottom}}>
          <Text style={basic.h1}>Dettagli</Text>
          <Button onPress={hideDetail} title="Chiudi"/>
        </View>
        <View style={{flex: 2, margin: 10}}>
          <Text style={basic.paragraph}>
            Nome: {user.name}
          </Text>
          <Text style={basic.paragraph}>
            Cognome: {user.surname}
          </Text>
          <Text style={basic.paragraph}>
            Username: {user.username}
          </Text>
          <Text style={basic.paragraph}>
            Email: {user.email}
          </Text>
        </View>
        <View style={{flex: 5, margin: 10}}>
          <Text style={{...basic.h1, marginTop: 10}}>
            Metodi di pagamento:
          </Text>
          <FlatList 
            data={user.PaymentMethods}
            renderItem={_renderItemList}
            keyExtractor={item => item.id}
          />
        </View>
      </View>
    </View>
  );

  return render();
}
