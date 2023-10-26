import { Text, View, Pressable } from "react-native";
import Header from './Header'
import Footer from './Footer'
import { styles } from '../style/style'
import { useEffect, useState } from "react";
import { NBR_OF_DICES, NBR_OF_THROWS, MAX_SPOT, BONUS_POINTS_LIMIT, BONUS_POINTS, SCOREBOARD_KEY } from "../constants/Game";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Container, Row, Col } from "react-native-flex-grid";
import AsyncStorage from "@react-native-async-storage/async-storage";

let board = []

export default Gameboard = ({ navigation, route }) => {

    const [playerName, setPlayerName] = useState('')
    const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS)
    const [status, setStatus] = useState('Throw dices')
    const [gameEndStatus, setGameEndStatus] = useState(false)
    const [roundEndStatus, setRoundEndStatus] = useState(false)
    // Mitkä nopat ovat kiinnitetty
    const [selectedDices, setSelectedDices] = useState(new Array(NBR_OF_DICES).fill(false))
    // Noppien silmäluvut
    const [diceSpots, setDiceSpots] = useState(new Array(NBR_OF_DICES).fill(0))
    // Onko silmäluvulle valittu pisteet
    const [selectedDicePoints, setSelectedDicePoints] = useState(new Array(MAX_SPOT).fill(false))
    // Kerätyt pisteet
    const [dicePointsTotal, setDicePointsTotal] = useState(new Array(MAX_SPOT).fill(0))
    // Tulostaulun pisteet
    const [scores, setScores] = useState([])
    const totalPoints = dicePointsTotal.reduce((partialSum, a) => partialSum + a, 0)
    const totalScore = totalPoints >= BONUS_POINTS_LIMIT ? totalPoints + BONUS_POINTS : totalPoints
    const pointsAwayFromBonus = totalScore < BONUS_POINTS_LIMIT ? BONUS_POINTS_LIMIT - totalScore : 0

    useEffect(() => {
        if (playerName === '' && route.params?.player) {
            setPlayerName(route.params.player)
        }
    }, [])

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getScoreboardData()
        })
        return unsubscribe
    }, [navigation])

    // ROWS:

    const dicesRow = []
    for (let dice = 0; dice < NBR_OF_DICES; dice++) {
        dicesRow.push(
            <Col key={'dice' + dice}>
                <Pressable
                    key={'dice' + dice}
                    onPress={() => selectDice(dice)}>
                    <MaterialCommunityIcons
                        name={board[dice]}
                        key={'dice' + dice}
                        size={50}
                        color={getDiceColor(dice)}
                    />
                </Pressable>
            </Col>
        )
    }

    const pointsRow = []
    for (let spot = 0; spot < MAX_SPOT; spot++) {
        pointsRow.push(
            <Col key={'pointsRow' + spot}>
                <Text key={'pointsRow' + spot}>{getSpotTotal(spot)}</Text>
            </Col>
        )
    }

    const pointsToSelectRow = []
    for (let diceButton = 0; diceButton < MAX_SPOT; diceButton++) {
        pointsToSelectRow.push(
            <Col key={'buttonsRow' + diceButton}>
                <Pressable
                    key={'buttonsRow' + diceButton}
                    onPress={() => selectDicePoints(diceButton)}
                >
                    <MaterialCommunityIcons
                        name={'numeric-' + (diceButton + 1) + '-circle'}
                        key={'buttonsRow' + diceButton}
                        size={35}
                        color={getDicePointsColor(diceButton)}
                    />
                </Pressable>
            </Col>
        )
    }

    // GAME FUNCTIONS:

    const throwDices = () => {
        if (nbrOfThrowsLeft === 0 && !roundEndStatus) {
            setStatus('Select your points before the next throw')
            return 1;
        } else if (nbrOfThrowsLeft === 0 && gameEndStatus) {
            setGameEndStatus(false)
            diceSpots.fill(0)
            dicePointsTotal.fill(0)
       }
        let spots = [...diceSpots]
        for (let i = 0; i < NBR_OF_DICES; i++) {
            if (!selectedDices[i]) {
                let randomNumber = Math.floor(Math.random() * 6 + 1)
                board[i] = 'dice-' + randomNumber
                spots[i] = randomNumber
            }
        }
        setNbrOfThrowsLeft(nbrOfThrowsLeft - 1)
        setDiceSpots(spots)
        setStatus('Select and throw dices again')
        setRoundEndStatus(false)
    }

    function selectDice(i) {
        if (nbrOfThrowsLeft < NBR_OF_THROWS && !gameEndStatus) {
            let dices = [...selectedDices]
            dices[i] = selectedDices[i] ? false : true
            setSelectedDices(dices)
        }
        else {
            setStatus('You have to throw dices first.')
        }
    }

    const selectDicePoints = (i) => {
        if (nbrOfThrowsLeft === 0) {
            let selectedPoints = [...selectedDicePoints]
            let points = [...dicePointsTotal]
            if (!selectedPoints[i]) {
                selectedPoints[i] = true
                let nbrOfDices = diceSpots.reduce(
                    (total, x) => (x === (i + 1) ? total + 1 : total), 0)
                points[i] = nbrOfDices * (i + 1)
            }
            else {
                setStatus('You already selected points for ' + (i + 1))
                return points[i]
            }

            setDicePointsTotal(points)
            setSelectedDicePoints(selectedPoints)
            setNbrOfThrowsLeft(NBR_OF_THROWS)
            selectedDices.fill(false)
            setRoundEndStatus(true)
            if (selectedPoints.every(value => value)) {
                setGameEndStatus(true)
                return
            }
            return points[i]
        }
        else {
            setStatus('Throw ' + NBR_OF_THROWS + ' times before setting points')
        }
    }

    const savePlayerPoints = async () => {
        const currentDate = new Date().getDate() + '.' + (new Date().getMonth() + 1) + '.' + new Date().getFullYear()
        const currentTime = new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()
        const newKey = scores.length + 1
        const playerPoints = {
            key: newKey,
            name: playerName,
            date: currentDate,  //nykyinen pvm
            time: currentTime, //nykyinen aika
            points: totalPoints //yhteispisteet (mahdollinen bonus mukaan)
        }
        try {
            const newScore = [...scores, playerPoints]
            const jsonValue = JSON.stringify(newScore)
            await AsyncStorage.setItem(SCOREBOARD_KEY, jsonValue)
        }
        catch (e) {
            console.log('Save error: ' + e)
        }
    }

    const getScoreboardData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(SCOREBOARD_KEY)
            if (jsonValue !== null) {
                let tmpScores = JSON.parse(jsonValue)
                setScores(tmpScores)
            }
        }
        catch (e) {
            console.log('Read error: ' + e)
        }
    }


    function getDiceColor(i) {
        return selectedDices[i] ? 'darkred' : 'darksalmon'
    }

    function getDicePointsColor(i) {
        return selectedDicePoints[i] && !gameEndStatus ? 'darkred' : 'darksalmon'
    }

    function getSpotTotal(i) {
        return dicePointsTotal[i]
    }



    return (
        <>
            <Header />
            <View style={styles.container}>
                <MaterialCommunityIcons name="dice-multiple" size={100} color="lightpink" style={styles.marginBottom}/>
                    { gameEndStatus 
                    ? <><Row><Text>Game over. Save your points!</Text></Row></>
                    : <><Row>{dicesRow}</Row>
                    <Text>Throws left: {nbrOfThrowsLeft}</Text>
                    <Text>{status}</Text></> }
                <Pressable onPress={() => throwDices()} style={styles.bluebutton}>
                    <Text style={styles.buttontext}>THROW DICES</Text>
                </Pressable>
                <Container fluid>
                    <Row>{pointsRow}</Row>
                </Container>
                <Container fluid>
                    <Row style={styles.marginBottom}>{pointsToSelectRow}</Row>
                </Container>
                <Text style={styles.boldtext}>Total: {totalScore}</Text>
                {totalPoints < BONUS_POINTS_LIMIT
                ? <Text>You are {pointsAwayFromBonus} points away from BONUS</Text>
                : <Text>Gongrats! {BONUS_POINTS} Bonus points added</Text>
                }
                <Pressable onPress={() => savePlayerPoints()} style={styles.bluebutton}>
                    <Text style={styles.buttontext}>SAVE POINTS</Text>
                </Pressable>
                <Text>Player: {playerName}</Text>
            </View>
            <Footer />
        </>
    )
}