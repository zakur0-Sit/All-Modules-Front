import "./PreferencesAndAllergensContent.css";
import { CheckBox } from "../CheckBox/CheckBox";
import { Button } from "../Button/Button";

export function PreferencesAndAllergensContent() 
{
    return (
        <main className="pref-main">
            <div className="alergy-list">
                <h2>List of Allergies</h2><br />
                <div className="list">
                    <CheckBox label="Celery" name="alergy"/>
                    <CheckBox label="Mustard" name="alergy"/>
                    <CheckBox label="Milk" name="alergy"/>
                    <CheckBox label="Eggs" name="alergy"/>
                    <CheckBox label="Soy" name="alergy"/>
                    <CheckBox label="Fish" name="alergy"/>
                    <CheckBox label="Gluten" name="alergy"/>
                    <CheckBox label="Nuts" name="alergy"/>
                    <CheckBox label="Peanuts" name="alergy"/>
                    <CheckBox label="Sesame" name="alergy"/>
                </div>
            </div>

            <div className="shop-preference-list">
                <h2>Shop Preference</h2>
                <div className="list">
                    <CheckBox label="Lidl" name="shop"/>
                    <CheckBox label="Kaufland" name="shop"/>
                    <CheckBox label="Mega" name="shop"/>
                    <CheckBox label="Auchan" name="shop"/>
                    <CheckBox label="Penny" name="shop"/>
                    <CheckBox label="Carrefour" name="shop"/>
                    <CheckBox label="Profi" name="shop"/>
                    <CheckBox label="Dedeman" name="shop"/>
                </div>
            </div>

            <div className="pref-btn">
                <Button text="Save Preferences" />
            </div>   

        </main>
    );
}