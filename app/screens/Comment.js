import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, Button, TextInput } from 'react-native'
import firebase from 'firebase'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
require('firebase/firestore')

import { fetchUsersData } from '../redux/actions'

function Comment(props) {
    const [comments, setComments] = useState([])
    const [postId, setPostId] = useState('')
    const [text, setText] = useState('')

    function matchUserToComment(comments) {
        for (let i = 0; i < comments.length; i++) {
            if (comments[i].hasOwnProperty('user')) {
                continue;
            }

            const user = props.users.find(x => x.uid === comments[i].creator)
            if (user == undefined) {
                props.fetchUsersData(comments[i].creator, false)
            }
            else {
                comments[i].user = user
            }
        }
        setComments(comments)
    }

    useEffect(() => {
        if (props.route.params.postId !== postId) {
            firebase.firestore()
                .collection('post')
                .doc(props.route.params.uid)
                .collection('userPost')
                .doc(props.route.params.postId)
                .collection('comments')
                .get()
                .then((snapshot) => {
                    let comments = snapshot.docs.map(doc => {
                        const data = doc.data()
                        const id = doc.id
                        return { id, ...data }
                    })
                    matchUserToComment(comments)
                })
            setPostId(props.route.params.postId)

        } else {
            matchUserToComment(comments)
        }
    }, [props.route.params.postId, props.users])

    const onCommentSend = () => {
        firebase.firestore()
            .collection('post')
            .doc(props.route.params.uid)
            .collection('userPost')
            .doc(props.route.params.postId)
            .collection('comments')
            .add(
                {
                    creator: firebase.auth().currentUser.uid,
                    text
                }
            )
    }
    return (
        <View>
            <FlatList
                numColumns={1}
                horizontal={false}
                data={comments}
                renderItem={({ item }) => (
                    <View>
                        {item.user !== undefined ?
                            <Text>{item.user.name}</Text>
                            : null}
                        <Text>{item.text}</Text>
                    </View>
                )}
            />
            <View>
                <TextInput placeholder='commnet...'
                    onChangeText={(text) => setText(text)}
                />
                <Button
                    onPress={() => onCommentSend()}
                    title="Send"
                />
            </View>
        </View>
    )
}

const mapStateToProps = (store) => ({
    users: store.usersState.users
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch)

export default connect(mapStateToProps, mapDispatchProps)(Comment)