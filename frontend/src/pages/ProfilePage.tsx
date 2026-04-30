import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MY_BOOKS } from "../data";
import Stars from "../components/Stars";
import "./ProfilePage.css";

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("alex_reader");
  const [wechat, setWechat] = useState("alex_wechat");
  const [city, setCity] = useState("Taichung / NCHU");
  const navigate = useNavigate();

  return (
    <div className="page">
      <h2 className="page__title">My Profile</h2>
      <div className="page__divider" />

      <div className="profile__grid">
        <div className="profile__left">
          <div className="profile__avatar-wrap">
            <div className="profile__avatar">A</div>
          </div>

          <div className="profile__fields">
            {[
              { label: "Username", value: username, setter: setUsername },
              { label: "WeChat username", value: wechat, setter: setWechat },
              { label: "University / City", value: city, setter: setCity },
            ].map(f => (
              <div className="field" key={f.label}>
                <label className="field__label">{f.label}</label>
                <input
                  className="field__input"
                  value={f.value}
                  readOnly={!editing}
                  onChange={e => f.setter(e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="profile__actions">
            <button
              className={`profile__btn profile__btn--edit ${editing ? "active" : ""}`}
              onClick={() => setEditing(!editing)}
            >
              {editing ? "Save" : "Edit profile"}
            </button>
            <button className="profile__btn profile__btn--delete">
              Delete profile
            </button>
          </div>
        </div>

        <div className="profile__right">
          <div className="page__header" style={{ marginBottom: 28 }}>
            <h3 className="profile__recent-title">Recent posts</h3>
            <button className="ghost-btn" onClick={() => navigate("/my-posts")}>
              My posts →
            </button>
          </div>

          {MY_BOOKS.slice(0, 2).map(b => (
            <div key={b.id} className="profile__book-item">
              <div className="profile__book-cover" style={{ background: b.cover }} />
              <div>
                <div className="profile__book-title">{b.title}</div>
                <div className="profile__book-author">{b.author}</div>
                <div className="profile__book-stars"><Stars rating={b.rating} /></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}