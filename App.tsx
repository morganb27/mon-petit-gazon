import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, TouchableHighlight, SafeAreaView } from 'react-native';
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
    <TouchableHighlight onPress={() => navigation.navigate('PlayerDetail', { playerId: item.id, position: item.position, ultraPosition: item.ultraPosition, clubId: item.clubId })}>
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
  const { playerId, position, clubId } = route.params;
  const [playerData, setPlayerData] = useState<any>(null);

  useEffect(() => {
    axios.get(`https://api.mpg.football/api/data/championship-player-stats/${playerId}/2022`)
      .then(response => {
        setPlayerData(response.data);
      })
      .catch(error => console.error(error));
  }, [setPlayerData]);


  return (
    <SafeAreaView style={{ flex: 1 }}>
      {!playerData ? (
        <Text>Loading...</Text>
      ) : (
        <View>
          <Text>ID: {playerData.id}</Text>
          <Text>Type: {playerData.type}</Text>
          <Text>Join Date: {playerData.championships?.["1"]?.[clubId].joinDate}</Text>
          

          {playerData.championships?.["1"]?.clubs?.[clubId]?.matches?.map((match: any, index: number) => (
  <View key={index}>
    <Text>Match ID: {match.matchId}</Text>
    <Text>Game Week Number: {match.gameWeekNumber}</Text>
    <Text>Date: {match.date}</Text>
  </View>
))}
        </View>
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