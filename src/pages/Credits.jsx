import credits from "../data/credits.json"
import { useNavigate } from "@solidjs/router"

import styles from '../App.module.css';

import Socials from "../components/Socials";

export default function Credits() {
  const navigate = useNavigate();

    return <main>

        <div class={styles.sidebar}>
          <button
            class={styles.buttonPrimary}
            type="button"
            onclick={() => navigate("/")}
          >Home</button>

          <Socials/>

        </div>

        <div class={styles.picker}>
        <For each={credits}>{(team) =>
            <>
              <div class={styles.categoryHeader}>
                <p>{team.name}</p>
              </div>
              <div class={styles.moduleList}>
                <For each={team.members}>{(member) => 
                  <div class={styles.member} href={member.link}>
                    <h3>{member.name}</h3>
                    <img src={member.type == "static" ? `avatars/${member.avatar}` : `https://crafatar.com/renders/body/${member.uuid}`} />
                    <p>{member.description}</p>
                  </div>
              }</For>
              </div>
            </>
          }</For>
        </div>
    </main>
}