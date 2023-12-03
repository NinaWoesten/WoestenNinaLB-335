import React from 'react';
import{View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const Todo = ({list}) => {
    return(
        <View style={styles.todos}>
            <Text style={styles.todoTitle} numberOfLines={1}>{list.heading}</Text>
        </View>
    );
};


const styles = StyleSheet.create({
    todos: {
        backgroundColor: 'pink',
        paddingVertical:30,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginHorizontal: 20,
        alignItems: 'center',
        width: 200,
    },
});

export default Todo;