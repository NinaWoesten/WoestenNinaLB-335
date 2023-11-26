import React from 'react';
import{View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { lightWhite } from './Colors';

const ToDo = (props) => {
    return(
        <View style={sytles.todo}>
            <View style={sytles.todoLeft}>
                <TouchableOpacity style={sytles.checkBox}></TouchableOpacity>
                <Text style={styles.todoText}>{props.text}</Text>
            </View>
            <View style={styles.circle}></View>
        </View>
    )
}
const sytles = StyleSheet.create({
    todo: {},
    todoLeft: {},
    checkBox: {},
    todoText: {},
    circle: {},
});
export default ToDo;