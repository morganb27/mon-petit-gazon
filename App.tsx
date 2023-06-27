import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, TouchableHighlight, SafeAreaView, ScrollView, Image } from 'react-native';
import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

type Player = {
  id: string;
  firstName: string;
  lastName: string;
  position: number;
  ultraPosition: number;
  clubId: string;
};

const ultraPositionMapping: { [key: number]: string } = {
  10: 'Gardien - G',
  20: 'Defenseur - D',
  21: 'Lateral - L',
  30: 'Milieu défensir - MD',
  31: 'Milieu offensif - MO',
  40: 'Attaquant - A',
};

const Stack = createStackNavigator();

const PlayerListScreen = ({ navigation }: { navigation: any }) => {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    axios.get('https://api.mpg.football/api/data/championship-players-pool/1')
      .then(response => {
        setPlayers(response.data.poolPlayers);
      })
      .catch(error => console.error(error));
  }, []);

  const renderItem = ({ item }: { item: Player }) => (
    <TouchableHighlight onPress={() => navigation.navigate('PlayerDetail', { playerId: item.id, firstname: item.firstName, lastName: item.lastName, position: item.position, ultraPosition: item.ultraPosition, clubId: item.clubId })}>
      <View>
        <Text>{item.firstName ? item.firstName : ''} {item.lastName ? item.lastName : ''} - {ultraPositionMapping[item.ultraPosition]}</Text>
      </View>
    </TouchableHighlight>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={players}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

const PlayerDetailScreen = ({ route }: { route: any }) => {
  const { playerId, firstName, lastName, clubId } = route.params;
  const [playerData, setPlayerData] = useState<any>(null);
  const [clubData, setClubData] = useState<any>(null);

  useEffect(() => {
    axios.get(`https://api.mpg.football/api/data/championship-player-stats/${playerId}/2022`)
      .then(response => {
        setPlayerData(response.data);
      })
      .catch(error => console.error(error));
  }, [setPlayerData]);

  useEffect(() => {
    axios.get("https://api.mpg.football/api/data/championship-clubs")
      .then(response => {
        setClubData(response.data);
      })
      .catch(error => console.error(error));
  }, [setClubData]);

  const getClubName = () => {
    if (clubData && clubData.championshipClubs && clubData.championshipClubs[clubId]) {
      return clubData.championshipClubs[clubId].name["en-GB"]; 
    }
    return "N/A";
  }


  return (
    <SafeAreaView style={{ flex: 1 }}>
      {!playerData ? (
        <Text>Loading...</Text>
      ) : (
        <ScrollView>
          <Text>ID: {playerData.id}</Text>
          <Text>Type: {playerData.type}</Text>
          <Text>Name: {firstName} {lastName}</Text>
          <Text>Club Name: {getClubName()}</Text>
          <Text>Total Played Matches: {playerData.championships?.["1"].clubs?.[clubId]?.stats?.totalPlayedMatches}</Text>
          <Text>Total Goals: {playerData.championships?.["1"].clubs?.[clubId]?.stats?.totalGoals}</Text>


          {clubData && clubData.championshipClubs && clubData.championshipClubs[clubId] && clubData.championshipClubs[clubId].defaultJerseyUrl && <Image source={{ uri: clubData.championshipClubs[clubId].defaultJerseyUrl }} style={{ width: 100, height: 100 }} />}

        </ScrollView>
      )}
    </SafeAreaView>
  );
};


const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PlayerList">
        <Stack.Screen name="PlayerList" component={PlayerListScreen} options={{ title: 'Player List' }} />
        <Stack.Screen name="PlayerDetail" component={PlayerDetailScreen} options={{ title: 'Player Detail' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;