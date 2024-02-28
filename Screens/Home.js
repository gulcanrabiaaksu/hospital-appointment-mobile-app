import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    Text,
    View,
    StatusBar,
    Dimensions,
    Image,
    FlatList,
    TextInput,
    TouchableOpacity,
    Keyboard,
    Pressable,
    ActivityIndicator,
    Button, // Make sure this import is present
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Footer from '../Components/Footer';
import Header from '../Components/Header';

const images = [
    'https://www.sigortadunyasi.com.tr/wp-content/uploads/2021/01/saglik-1.jpg',
    'https://www.akgunyazilim.com.tr/uploads/sectorproductsdigerfoto/1602081961dc40.jpg',
    'https://assets.kpmg.com/is/image/kpmg/saglik-turizmi:cq5dam.web.512.341',
    'https://www.marketingturkiye.com.tr/wp-content/uploads/2022/08/saglik.png',
];

const staticHastaneData = [
    { key: '1', title: 'Serdivan Devlet Hastanesi', imgUrl: 'https://static.daktilo.com/sites/243/uploads/2023/08/15/serdivan-devlet-hastanesi-1.jpg' },
    { key: '2', title: 'Sakarya Eğitim Araştırma', imgUrl: 'https://static.daktilo.com/sites/243/uploads/2020/08/11/large/sakarya-egitim-ve-arastirma-hastanesi-13-1597129000.jpg' },
    { key: '3', title: 'Toyota Hastanesi', imgUrl: 'data:image/jpeg;base64,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' },

    // ... diğer hastane verileri
];

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const Home = ({ navigation: nav }) => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [imgActive, setImgActive] = useState(0);

    useEffect(() => {
        // Simulate loading, replace this with your actual data fetching logic
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);

    if (loading) {
        return <ActivityIndicator />;
    }

    const onChange = (nativeEvent) => {
        if (nativeEvent) {
            const slide = Math.ceil(
                nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width
            );
            if (slide !== imgActive) {
                setImgActive(slide);
            }
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Image style={styles.hastaneImage} source={{ uri: item.imgUrl }} />
            <Text style={styles.itemTitle}>{item.title}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                onScroll={({ nativeEvent }) => onChange(nativeEvent)}
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                horizontal
                style={styles.wrap}
            >
                {images.map((e, index) => (
                    <Image
                        key={e}
                        resizeMode="stretch"
                        style={styles.wrap}
                        source={{ uri: e }}
                    />
                ))}
            </ScrollView>
            <View style={styles.wrapDot}>
                {images.map((e, index) => (
                    <Text
                        key={e}
                        style={imgActive == index ? styles.dotActive : styles.dot}
                    >
                        ●
                    </Text>
                ))}
            </View>
            <View style={styles.randevuAlButton}>
                <Button title="Randevu Al" onPress={() => navigation.navigate('CreateAppointment')} />
            </View>
            <FlatList
                horizontal
                data={staticHastaneData}
                keyExtractor={(item) => item.key.toString()}
                renderItem={renderItem}
                style={styles.hastaneList}
            />
            
        </SafeAreaView>
    );
};

export default Home;

const styles = StyleSheet.create({

    wrapDot: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        alignSelf: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    wrap: {
        width: WIDTH,
        height: HEIGHT * 0.25,
    },
    wrapDot: {
        position: 'absolute',
        buttom: 0,
        flexDirection: 'row',
        alignSelf: 'center'
    },
    dotActive: {
        margin: 3,
        color: 'black',
    },
    randevuAlButton:{
        marginTop:100,
    },
    dot: {
        margin: 3,
        color: 'white'
    },
    hastaneList: {
        marginVertical: 10,
        marginTop:100,
    },
    hastaneImage: {
        width: '100%',
        height: 100,

        borderRadius: 20,
        marginBottom: 10,
    },
    itemContainer: {
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    container: {
        backgroundColor: '#e5e5e5e',
        padding: 15,
        borderRadius: 15,
        margin: 5,
        marginHorizontal: 10,
        flexdirection: 'row',
        alignItems: 'center'
    },
    innerContainer: {
        alignItems: 'center',
        flexDirection: 'column',
        marginLeft: 45,
    },
    itemheading: {
        fontWeight: 'bold',
        fontSize: 18,
        marginRight: 22,
    },
    itemTitle: {
        marginTop: 5,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    formContainer: {
        flexDirection: 'row',
        height: 80,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 100,
    },
    input: {
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'black',
        paddingLeft: 16,
        flex: 1,
        marginRight: 5,
    },
    button: {
        height: 47,
        borderRadius: 5,
        backgroundColor: '#788eec',
        width: 80,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 20
    },
    todoIcon: {
        marginTop: 5,
        fontSize: 20,
        marginLeft: 14
    },
});
