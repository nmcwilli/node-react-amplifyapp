import React, { useState, useEffect } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { API, Storage } from 'aws-amplify';
import {
  Button,
  Flex,
  Heading,
  Image,
  Text,
  TextAreaField,
  TextField,
  View,
  withAuthenticator,
} from "@aws-amplify/ui-react";
import { 
  listNotes 
} from "./graphql/queries";
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation,
} from "./graphql/mutations";

const App = ({ signOut }) => {
  const [notes, setNotes] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  /* Fetch the notes */
  useEffect(() => {
    fetchNotes();
  }, []);

  /* Toggle expansion */
  const toggleExpansion = () => {
    setIsExpanded((prevExpanded) => !prevExpanded);
  };

  async function fetchNotes() {
    const apiData = await API.graphql({ query: listNotes });
    const notesFromAPI = apiData.data.listNotes.items;
    await Promise.all(
      notesFromAPI.map(async (note) => {
        if (note.image) {
          const url = await Storage.get(note.name);
          note.image = url;
        }
        return note;
      })
    );
    setNotes(notesFromAPI);
  }

  async function createNote(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const image = form.get("image");
    const data = {
      name: form.get("name"),
      description: form.get("description"),
      image: image.name,
    };
    if (!!data.image) await Storage.put(data.name, image);
    await API.graphql({
      query: createNoteMutation,
      variables: { input: data },
    });
    fetchNotes();
    event.target.reset();
  }  

  async function deleteNote({ id, name }) {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
    await Storage.remove(name);
    await API.graphql({
      query: deleteNoteMutation,
      variables: { input: { id } },
    });
  }

  return (
    <View className="App">
      <br />
      <Heading level={1}>Simple Notes</Heading>
      <br />
      <button onClick={toggleExpansion}>
        {isExpanded ? 'Collapse View' : 'Add new note'}
      </button>
      {isExpanded && (
        <View as="form" margin="3rem 0" onSubmit={createNote}>
          <div className="expanded-view">
            <Flex direction="column" justifyContent="center">
              <TextField
                name="name"
                placeholder="Note Title"
                label="Note Name"
                style={{ width: '100%' }}
                class="Text-input-name"
                labelHidden
                variation="quiet"
                required
              />
              <TextAreaField
                name="description"
                placeholder="Note Description"
                label="Note Description"
                style={{ flex: 1 }}
                class="Text-area-note"
                labelHidden
                variation="quiet"
                rows={8}
                required
              />
              <div>
                <View
                  name="image"
                  as="input"
                  type="file"
                  style={{ flex: 1 }}
                />
              </div>
              <div>
                <Button 
                  type="submit" 
                  style={{ flex: 1 }}
                  class="Submit-button"
                  variation="primary">
                  Create Note
                </Button>
              </div>
            </Flex>
          </div>
        </View>
      )}
      <br />
      <Heading level={2}><br />My Notes</Heading>
      <View className="notes-container" margin="3rem 0">
        {notes.map((note) => (
          <div className="note-container">
            <Flex
              key={note.id || note.name}
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <Text as="strong" fontWeight={700}>
                {note.name}
              </Text>
              <Text as="span">{note.description}</Text>
              {note.image && (
                <Image
                  src={note.image}
                  alt={`visual aid for ${note.name}`}
                  style={{ width: 400 }}
                />
              )}
              <Button variation="link" onClick={() => deleteNote(note)}>
                [x]
              </Button>
            </Flex>
          </div>
        ))}
      </View>
      <Button onClick={signOut}>Sign Out</Button>
    </View>
  );
};

export default withAuthenticator(App);