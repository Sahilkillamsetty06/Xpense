import cron from 'node-cron';
import User from './models/UserSchema';// Adjust the path if needed

// Schedule task to run at midnight on the 1st day of each month
cron.schedule('* * * * *', async () => {
  try {
    // Update all users, setting each category's limitUtilised to 0
    await User.updateMany(
      {},
      { $set: { "categories.$[].limitUtilised": 0 } }
    );
    console.log('All categories limitUtilised reset to 0');
  } catch (err) {
    console.error('Error resetting limitUtilised:', err);
  }
});
