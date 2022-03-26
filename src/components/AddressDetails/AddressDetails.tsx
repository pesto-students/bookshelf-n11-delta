import styles from './AddressDetails.module.scss';

export const AddressDetails = ({address}) => {
  return (
    <div className={styles.address}>
      <div>
        <span className={styles.title}>Area/Street: </span>
        {address.addressLine1}
      </div>
      <div>
        <span className={styles.title}>City: </span>
        {address.city}
      </div>
      <div>
        <span className={styles.title}>State: </span>
        {address.state}
      </div>
      <div>
        <span className={styles.title}>Pincode: </span>
        {address.pincode}
      </div>
    </div>
  );
};
