import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { fetchUsersPage } from "./services/users";
import { basic } from "./theme";

export default function App () {
  return (
    <View style={basic.container}>
      <StatusBar style="auto"/>

      <Text style={basic.h1}>
        Ecco la challenge!
      </Text>
      <Text style={basic.paragraph}>
        Puoi usare services/fetchUsersPage.js per recuperare le informazioni dei nostri utenti
      </Text>
      <Text style={basic.boldParagraph}>
        Buona fortuna!
      </Text>

      <Users/>
    </View>
  );
}

const Users = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData () {
      const usersList = await fetchUsersPage();
      const data = await usersList.json();

      setData([data.Users[0]]);
    }

    fetchData();
  }, []);

  return data.map((user, index) => <Text key={index} style={basic.debug}>{user.email},{user.name},{user.surname}</Text>);
};
