import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity } from "react-native";
import { StyleSheet, Text, View, Image, TextInput, Pressable,FlatList, Keyboard, Platform, RefreshControl,} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Feather, Entypo } from "@expo/vector-icons";
// import RBSheet from "react-native-raw-bottom-sheet";
// import PushNotification from "react-native-push-notification";
    
export default function App() {
  const [news, setData] = useState([]);
  const [tops, setTops] = useState([]);
  const [isLoading, setLoading] = useState(false)
  const [search, setSearch] = useState('');
  const [isRefreshing,setIsRefresh] = useState(false)
  const [isTop,setisTop] = useState(true)
  const [isTrend,setisTrend] = useState(false)
  const [scrollViewWidth, setScrollViewWidth] = React.useState(0);
  const boxWidth = scrollViewWidth * 0.8;
  const boxDistance = scrollViewWidth - boxWidth;
  const halfBoxDistance = boxDistance / 2;
  const flatListRef = React.useRef();


  const topback = () =>{
    flatListRef.current.scrollToOffset({
      animated: true,
      offset: 0,
    });
  }

  const handleTop = () =>{
    if (isTop == true){
    setisTop(false);
    if (Platform == 'web'){
        console.log('false')
      }
      else{
        console.log("already on top");
      }
   }
    else if (isTop == false){
      setisTop(true);
      setisTrend(false);
      getAPIData('https://inshorts.vercel.app//news/top?offset=0&limit=20');
      setLoading(true);
    }
  }
   const handleTrend = () =>{
    if (isTrend == true){

      setisTrend(false);
      if (Platform == 'web'){
        console.log('false')
      }
      else{
        console.log('Already On Trending News');
      }
      
   }
    else if (isTrend == false){
      setisTrend(true);
      setisTop(false);
      getAPIData('https://inshorts.vercel.app/news/trending?offset=0&limit=20');
      setLoading(true);
    }
  }
 const Bottomsheet = () =>{
  // this.RBSheet.open()
  getTopicsData('https://inshorts.vercel.app/news/topics')
 }

//  const Setopic = (topicn) => {
//   console.log(topicn)
//   console.log("clicked")
//   // getAPIData(`https://inshorts.vercel.app/news/${id}`)
//  }

  const handleRefresh = () =>{
    setIsRefresh(true);
    getAPIData('https://inshorts.vercel.app/news/top?offset=0&limit=20')
    setTimeout(() =>{
      setIsRefresh(false);

    },2000)
  }

  const removeExtraSpace = (s) => s.trim().split(/ +/).join(' ');
  function ConvertJsonDateString(jsonDate) {
        var shortDate = null;
        if (jsonDate) {
            var regex = /-?\d+/;
            var matches = regex.exec(jsonDate);
            var dt = new Date(parseInt(matches[0]));
            var month = dt.getMonth() + 1;
            var monthString = month > 9 ? month : '0' + month;
            var day = dt.getDate();
            var dayString = day > 9 ? day : '0' + day;
            var year = dt.getFullYear();
            shortDate = dayString + '/' + monthString + '/' + year;
        }
        return shortDate;
    };

  const getAPIData = async (aurl) => {
    try {
      let url = aurl;
      const response = await fetch(url);
      const result = await response.json();

      if (result && result.data && result.data.articles) {
        setData(result.data.articles);
      }
    } catch (error) {
      console.error('Error fetching API data:', error);
    }
  };

  const getTopicsData = async (aurl) => {
    try {
      let url = aurl;
      const response = await fetch(url);
      const result = await response.json();

      if (result && result.data && result.data.topics) {
        setTops(result.data.topics);
      }
    } catch (error) {
      console.error('Error fetching API data:', error);
    }
  };

  const updateSearch = (text) => {
    setSearch(text);
  };

  const searchup = () => {
    Keyboard.dismiss
    getAPIData(`https://inshorts.vercel.app/news/search?query=${search}&offset=0&limit=10`);
  }
  const searching = (text) => {
    Keyboard.dismiss
    getAPIData(`https://inshorts.vercel.app/news/search?query=${text}&offset=0&limit=10`);
  }

  useEffect(() => {
    getAPIData('https://inshorts.vercel.app/news/top?offset=0&limit=20');
  }, []);


  return (
    <View style={styles.container}>
      {news.length ? (
        <FlatList
          data={news}
          contentContainerStyle={{ paddingVertical: 16 }}
          contentInsetAdjustmentBehavior="never"
          snapToAlignment="center"
          style={styles.slide}
          decelerationRate="fast"
          ref={flatListRef}
          automaticallyAdjustContentInsets={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={1}
          pagingEnabled
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => handleRefresh()}
            ></RefreshControl>
          }
          ListHeaderComponent={
            <View>
              <View style={styles.searchbar}>
                <TextInput
                  style={styles.textinput}
                  placeholder="Search here"
                  placeholderTextColor="white"
                  value={search}
                  onChangeText={(text) => updateSearch(text)}
                  onSubmitEditing={(event) => searching(event.nativeEvent.text)}
                />
                <Pressable style={styles.button} onPress={searchup}>
                  <Feather
                    name="search"
                    size={20}
                    color="#ffffff"
                    style={{ marginLeft: 1 }}
                  />
                </Pressable>
              </View>

              <View style={styles.filtbar}>
                <Text style={styles.filtertxt}>Filters : </Text>
                <Pressable
                  id="topbut"
                  onPress={handleTop}
                  style={styles.filter}
                >
                  <Text style={styles.filtertxt}>Top</Text>
                </Pressable>
                <Pressable
                  id="trendbut"
                  onPress={handleTrend}
                  style={styles.filter}
                >
                  <Text style={styles.filtertxt}>Trending</Text>
                </Pressable>
                <Pressable style={styles.filter} onPress={Bottomsheet}>
                  <Text style={styles.filtertxt}>Add Your Own Filter</Text>
                </Pressable>
                // Rbsheet list view here 
              </View>
            </View>
          }
          ListFooterComponent={
            <View>
              <Text style={styles.title}>
                Looks Like You Have Reached The End.
              </Text>
              <Pressable
                onPress={topback}
                style={styles.buttonwhite}
              >
                <Text>Back To Top</Text>
              </Pressable>
            </View>
          }
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <View style={styles.div}>
              <Image
                style={styles.img}
                source={{
                  uri: item.imageUrl,
                }}
                onError={() => console.log("Failed to load image")}
              />
              <Text style={styles.sub}>{removeExtraSpace(item.subtitle)}</Text>
              <Text style={styles.title}>{removeExtraSpace(item.title)}</Text>
              <Text style={styles.content}>"{removeExtraSpace(item.content)}"</Text>
              <Text style={styles.source}>Source : {removeExtraSpace(item.sourceName)}</Text>
              <Text style={styles.date}>Date : {ConvertJsonDateString(item.createdAt)}</Text>
            </View>
          )}
        ></FlatList>
      ) : (
        <Text style={{ fontSize: 20, textAlign: "center", color:"#ffffff"}}>
          Loading News... If takes longer than expected then it might be a server issue
        </Text>
      )}
      <StatusBar
        style="light-content"
        backgroundColor="#363636"
        color="white"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:10,
    backgroundColor: '#090909',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallimg:{
    width:30,
    height:30,
  },
  divtopics:{
    backgroundColor:'#232222',
    padding:10,
    margin:10,
    color:'#ffffff',
    borderRadius:10
  },
  sheettext:{
    color:'black',
    margin:20,
    fontSize:20,
  },
  date:{
    fontSize:10,
    padding:0,
    color:"white"
  },
  filtbar:{
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    marginBottom:20,
    justifyContent:'center',

  },
  filtertxt:{
    textAlign:'center',
    color: '#ffffff',
  },
  
  filter:{
    backgroundColor:'#544f4f70',
    margin:5,
    textAlign:'center',
    borderRadius:5,
    borderWidth:2,
    borderColor:'grey',
    borderStyle:'solid',
    padding:7,
  },
  slide:{
    backgroundColor:'transparent'
  },
  source:{
    margin:10,
    color:'#00a1d7',
  },
  sub:{
    textAlign:'center',
    margin:10,
    color:'grey',
  },
   button: {
    alignItems:'center',
    justifyContent:'center',
    padding: 10,
    width: 80,
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  buttonwhite:{
    alignItems:'center',
    justifyContent:'center',
    marginLeft:'auto',
    marginRight:'auto',
    padding: 10,
    width: 300,
    borderRadius: 10,
    backgroundColor:'#ffffff',
  },
  butt:{
    color:'white',
  },
  logo:{
    height:100,
    width:100,
    borderRadius:10,
    marginTop:50,
    marginLeft:'auto',
    marginRight:'auto'
  },
  h1:{
    textAlign:'center',
    marginTop:30,
    marginBottom:5,
    fontSize:30,
    color:'white',
  },
  searchbar:{
    backgroundColor:'#322f2f',
    borderRadius:10,
    justifyContent:'flex-start',
    padding:5,
    width:370,
    marginTop:60,
    marginBottom:20,
    marginLeft:'auto',
    marginRight:'auto',
    display: 'flex',
    flexDirection:'row',
  },
  textinput:{
    color:'white',
    padding:10,
    width:300,
    height:50,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    color: '#ffffff',
    margin:10,
  },
  content:{
    color:'#ffffff',
    textAlign:'center',
  },
  div:{
    border:'solid 2px #9c9898',
    backgroundColor: '#322f2f',
    borderRadius:10,
    padding: 20,
    margin:10,
    marginBottom:20,
    height:Platform.OS === 'ios' ? 'auto' : 615,
    width:Platform.OS === 'web' ? 400 : 'auto',
    justifyContent:'center',
    alignItems:'center',
    borderColor:'grey',
    borderWidth:2,
    borderStyle:'solid',
  },
  blacktxt:{
    color:'black'
  },
  img:{
    marginLeft:'auto',
    marginRight:'auto',
    borderRadius:10,
    width:320,
    height:200,
  }
});