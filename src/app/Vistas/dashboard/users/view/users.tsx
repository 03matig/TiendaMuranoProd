"use client";

import { useEffect, useState } from "react";
import styles from "./users.module.css";
import Sidebar from "../../components/Sidebar";

type User = {
  id: string;
  name: string;
  email: string;
  pw: string;
  role: string;
};

export default function UsersView() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users/view-users");
        const json = await res.json();
        setUsers(json.users);
      } catch (error) {
        console.error("Error al cargar usuarios", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className={styles.container}>
      <Sidebar />
      <section className={styles.section}>
        <h2 className={styles.heading}>Usuarios</h2>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
