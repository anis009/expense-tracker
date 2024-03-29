import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserContext } from "../store/user-context";
import { UserStore } from "../utils/user";
import SetExpenseForm from "../components/SetExpenseModal";
import { TargetServices } from "../services/target";
import Loading from "../shared/Loading";
import { Entypo } from "@expo/vector-icons";
import TargetExpense from "../components/TargetExpense";

const ProfileScreen = () => {
  const { user, setUser } = useContext(UserContext);
  const [modal, setModal] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["target", user?._id],
    queryFn: async () => {
      return await TargetServices.getTargets(user?._id);
    },
  });
  const ExpenseModal = () => {
    setModal(true);
  };

  const onLogout = () => {
    setUser(null);
    UserStore.removeToken();
  };
  if (isLoading) {
    return <Loading />;
  }

  console.log(data);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.profileCard,
          {
            alignSelf: "center",
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#000" }}>Name:</Text>
          <Text style={styles.text}>{user.name}</Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Text style={{ color: "#000" }}>Email:</Text>
          <Text style={styles.text}>{user.email}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: "orange",
          padding: 10,
          marginBottom: 10,
          width: "100%",
          borderRadius: 10,
        }}
        onPress={ExpenseModal}
      >
        <Text
          style={{
            color: "purple",
            fontSize: 16,
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          Set Expense
        </Text>
      </TouchableOpacity>

      <SetExpenseForm
        modalVisible={modal}
        setModalVisible={setModal}
        refetch={refetch}
      />

      <View
        style={{
          width: "100%",
          height: 50,
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 15,
          borderBottomWidth: 3,
          borderBottomColor: "#ccc",
        }}
      >
        <Text>Target Expenses</Text>
      </View>
      <ScrollView
        style={{
          width: "100%",
        }}
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {data && data.length > 0 ? (
          data.map((item, index) => {
            return <TargetExpense refetch={refetch} item={item} key={index} />;
          })
        ) : (
          <View>
            <Text
              style={{
                fontSize: 30,
                textAlign: "center",
                color: "red",
                fontWeight: "900",
                marginTop: 30,
              }}
            >
              There is no target expense
            </Text>
          </View>
        )}
      </ScrollView>
      <TouchableOpacity
        style={{
          backgroundColor: "red",
          padding: 10,
          marginBottom: 10,
          width: "100%",
          elevation: 10,
          borderRadius: 10,
          marginTop: 10,
        }}
        onPress={onLogout}
      >
        <Text
          style={{
            color: "white",
            fontSize: 16,
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginVertical: 20,
    width: "100%",
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "100%",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  text: {
    fontSize: 16,
    color: "orange",
  },
});
