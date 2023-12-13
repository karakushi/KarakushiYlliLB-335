import React, { useState } from 'react';
import { Text, View, Button, TextInput, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const windowWidth = Dimensions.get('window').width;

const TodoApp = ({ categories, setCategories, todos, setTodos }) => {
 const [todoText, setTodoText] = useState('');
 const [shortDescription, setShortDescription] = useState('');
 const [longDescription, setLongDescription] = useState('');
 const [selectedCategory, setSelectedCategory] = useState('');
 const [editingIndex, setEditingIndex] = useState(null);

 const addTodo = () => {
    if (todoText.trim() === '' || selectedCategory.trim() === '') {
      return;
    }

    const newTodo = {
      text: todoText,
      shortDescription: shortDescription,
      longDescription: longDescription,
      category: selectedCategory,
      dueDate: new Date(),
      completed: false,
    };

    if (editingIndex !== null) {
      let updatedTodos = [...todos];
      updatedTodos[editingIndex] = newTodo;
      setTodos(updatedTodos);
      setEditingIndex(null);
    } else {
      setTodos([...todos, newTodo]);
    }

    setTodoText('');
    setShortDescription('');
    setLongDescription('');
    setSelectedCategory('');
 };

 const editTodo = (index) => {
    const todoToEdit = todos[index];
    setTodoText(todoToEdit.text);
    setShortDescription(todoToEdit.shortDescription);
    setLongDescription(todoToEdit.longDescription);
    setSelectedCategory(todoToEdit.category);
    setEditingIndex(index);
 };

 const toggleTodo = (index) => {
    let updatedTodos = [...todos];
    updatedTodos[index].completed = !updatedTodos[index].completed;
    setTodos(updatedTodos);
 };

 const deleteTodo = (index) => {
    let newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
    setEditingIndex(null);
 };

 const renderItem = ({ item, index }) => (
    <View style={styles.row}>
      <TouchableOpacity onPress={() => toggleTodo(index)}>
        <Text style={[styles.bullet, { color: item.completed ? 'green' : 'black', fontSize: 50 }]}>
          {item.completed ? '🙌' : '◻️'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => editTodo(index)}>
        <Text style={[styles.buttonText, { color: 'blue' }]}>Edit</Text>
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <Text>{`Todo: ${item.text}`}</Text>
        <Text>{`Kategorie: ${item.category}`}</Text>
        <Text>{`Kurzbeschreibung: ${item.shortDescription}`}</Text>
        <Text>{`Langbeschreibung: ${item.longDescription}`}</Text>
      </View>
      <TouchableOpacity onPress={() => deleteTodo(index)}>
        <Text style={[styles.buttonText, { color: 'red' }]}>Delete</Text>
      </TouchableOpacity>
    </View>
 );

 return (
  <View style={styles.container}>
    <Text style={styles.title}>Todo App</Text>

    <TextInput
      placeholder="Todo eingeben"
      value={todoText}
      onChangeText={(text) => setTodoText(text)}
      style={styles.input}
    />

      <TextInput
        placeholder="Kurzbeschreibung"
        value={shortDescription}
        onChangeText={(text) => setShortDescription(text)}
        style={styles.input}
      />

      <TextInput
        placeholder="Langbeschreibung"
        value={longDescription}
        onChangeText={(text) => setLongDescription(text)}
        style={styles.input}
      />

      <Text style={styles.subtitle}>Kategorie:</Text>
      <View style={{ flex: 1, marginBottom: 16 }}>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Kategorie auswählen" value="" />
          {categories.map((category, index) => (
            <Picker.Item key={index} label={category} value={category} />
          ))}
        </Picker>
      </View>

      <Button title={editingIndex !== null ? 'Todo aktualisieren' : 'Todo hinzufügen'} onPress={addTodo} />

      <Text style={styles.subtitle}>Todos:</Text>
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
 );
};

const CategoryManagement = ({ categories, setCategories }) => {
 const [categoryText, setCategoryText] = useState('');

 const addCategory = () => {
    if (categoryText.trim() === '') {
      return;
    }

    setCategories([...categories, categoryText]);
    setCategoryText('');
 };

 const editCategory = (index) => {
    const categoryToEdit = categories[index];
    setCategoryText(categoryToEdit);
    deleteCategory(index);
 };

 const deleteCategory = (index) => {
    let newCategories = [...categories];
    newCategories.splice(index, 1);
    setCategories(newCategories);
 };

 const renderCategoryItem = ({ item, index }) => (
    <View style={styles.row}>
      <TouchableOpacity onPress={() => editCategory(index)}>
        <Text style={[styles.buttonText, { color: 'blue' }]}>Edit</Text>
      </TouchableOpacity>
      <Text>{item}</Text>
      <TouchableOpacity onPress={() => deleteCategory(index)}>
        <Text style={[styles.buttonText, { color: 'red' }]}>Delete</Text>
      </TouchableOpacity>
    </View>
 );

 return (
    <View style={styles.container}>
      <Text style={styles.title}>Kategorieverwaltung</Text>

      <TextInput
        placeholder="Kategorie eingeben"
        value={categoryText}
        onChangeText={(text) => setCategoryText(text)}
        style={styles.input}
      />

      <Button title="Kategorie hinzufügen" onPress={addCategory} />

      <Text style={styles.subtitle}>Kategorien:</Text>
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
 );
};

const App = () => {
 const [categories, setCategories] = useState([]);
 const [todos, setTodos] = useState([]);
 const [selectedTab, setSelectedTab] = useState('todos');

 return (
    <View style={{ flex: 1, paddingTop: 50 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 }}>
        <Button title="Todos" onPress={() => setSelectedTab('todos')} />
        <Button title="Kategorien" onPress={() => setSelectedTab('categories')} />
      </View>

      {selectedTab === 'todos' ? (
        <TodoApp categories={categories} setCategories={setCategories} todos={todos} setTodos={setTodos} />
      ) : (
        <CategoryManagement categories={categories} setCategories={setCategories} />
      )}
    </View>
 );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 16,
    width: windowWidth - 32,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
  },
  picker: {
    height: 50,
    width: windowWidth - 32,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  bullet: {
    marginRight: 8,
    fontSize: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333333',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#333333',
  },
});


export default App;
