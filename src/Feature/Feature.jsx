import styles from './Feature.module.css'

const Feature = (props) => {
  return (
    <div className={styles.box}>
      <h1>{props.featuretitle}</h1>
      <ul>
        <li>{props.feature1}</li>
        <li>{props.feature2}</li>
      </ul>
    </div>
  )
}

export default Feature