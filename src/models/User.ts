import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

interface IUser {
    firstName?: string;
    lastName?: string;
    email: string;
    passwordHash: string;
    dateOfBirth?: Date;
    /*
    role: Types.ObjectId | Role;
    sports: Types.Array<Types.ObjectId | Sport>;
    notices: Types.Array<Types.ObjectId | Notice>;
    documents: Types.Array<Types.ObjectId | UserDocument>;
    // Inscriptions à des sports de combat
    registrations: Types.Array<Types.ObjectId | Registration>;
    // cours de sport de combat
    classes: Types.Array<Types.ObjectId | Class>;
    // Invitation à coacher un cours de sport de combat (seulement les coachs)
    invitations: Types.Array<Types.ObjectId | Invitation>;
    */
}

const userSchema = new Schema({
    firstName: { type: String, },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    dateOfBirth: { type: Date },
    /*
    role: { type: Schema.Types.ObjectId, ref: 'Role', default: 'ROLE_USER' },
    sports: [{ type: Schema.Types.ObjectId, ref: 'Sport' }],
    notices: [{ type: Schema.Types.ObjectId, ref: 'Notice' }],
    documents: [{ type: Schema.Types.ObjectId, ref: 'Document' }],
    registrations: [{ type: Schema.Types.ObjectId, ref: 'Registration' }],
    classes: [{ type: Schema.Types.ObjectId, ref: 'Class' }],
    invitations: [{ type: Schema.Types.ObjectId, ref: 'Invitation' }],
    */

});

userSchema.pre('save', async function (next) {
    if (!this.isModified('passwordHash')) return next();
    this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
    next();
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;