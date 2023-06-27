import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, TouchableHighlight, SafeAreaView, ScrollView, Image, TextInput } from 'react-native';
import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { styles } from './styles';

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
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('https://api.mpg.football/api/data/championship-players-pool/1')
      .then(response => {
        setPlayers(response.data.poolPlayers);
      })
      .catch(error => console.error(error));
  }, []);

  const renderItem = ({ item }: { item: Player }) => (
    <TouchableHighlight onPress={() => navigation.navigate('PlayerDetail', { playerId: item.id, firstname: item.firstName, lastName: item.lastName, position: item.position, ultraPosition: item.ultraPosition, clubId: item.clubId })} underlayColor="transparent" >
      <View style={styles.item}>
        <Text style={styles.itemText}>{item.firstName ? item.firstName : ''} {item.lastName ? item.lastName : ''} - {ultraPositionMapping[item.ultraPosition]}</Text>
      </View>
    </TouchableHighlight>
  );

  const filteredPlayers = players.filter(player => 
    `${player.firstName} ${player.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={ styles.container }>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        onChangeText={text => setSearch(text)}
        value={search}
        placeholder="Search players..."
      />
      <FlatList
        data={filteredPlayers}
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
    <SafeAreaView style={ styles.container }>
      {!playerData ? (
        <Text>Loading...</Text>
      ) : (
        <ScrollView>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.playerName}>{firstName} {lastName}</Text>
            {clubData && clubData.championshipClubs && clubData.championshipClubs[clubId] && clubData.championshipClubs[clubId].defaultAssets && clubData.championshipClubs[clubId].defaultAssets.logo && clubData.championshipClubs[clubId].defaultAssets.logo.small && 
              <Image source={{ uri: clubData.championshipClubs[clubId].defaultAssets.logo.small }} style={{ width: 50, height: 50, marginLeft: 10 }} />}
          </View>


          <View style={styles.infoGrid}>
  <View style={styles.infoBox}>
    <Text style={styles.infoBoxTitle}>Games</Text>
    <Text style={styles.infoBoxValue}>{playerData.championships?.["1"].clubs?.[clubId]?.stats?.totalPlayedMatches ?? 'N/A'}</Text>
  </View>
  <View style={styles.infoBox}>
    <Text style={styles.infoBoxTitle}>Goals</Text>
    <Text style={styles.infoBoxValue}>{playerData.championships?.["1"].clubs?.[clubId]?.stats?.totalGoals ?? 'N/A'}</Text>
  </View>
  <View style={styles.infoBox}>
    <Text style={styles.infoBoxTitle}>Rating</Text>
    <Text style={styles.infoBoxValue}>{playerData.championships?.["1"].clubs?.[clubId]?.stats?.averageRating ? playerData.championships?.["1"].clubs?.[clubId]?.stats?.averageRating.toFixed(1) : 'N/A'}</Text>
  </View>
  <View style={styles.infoBox}>
    <Text style={styles.infoBoxTitle}>Assists</Text>
    <Text style={styles.infoBoxValue}>{playerData.championships?.["1"].clubs?.[clubId]?.stats?.totalGoalAssist ?? 'N/A'}</Text>
  </View>
  <View style={styles.infoBox}>
    <Text style={styles.infoBoxTitle}>Yellow Cards</Text>
    <Text style={styles.infoBoxValue}>{playerData.championships?.["1"].clubs?.[clubId]?.stats?.totalYellowCard ?? 'N/A'}</Text>
  </View>
  <View style={styles.infoBox}>
    <Text style={styles.infoBoxTitle}>Red Cards</Text>
    <Text style={styles.infoBoxValue}>{playerData.championships?.["1"].clubs?.[clubId]?.stats?.totalRedCard ?? 'N/A'}</Text>
  </View>
</View>

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