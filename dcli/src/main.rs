use std::process::exit;

use anyhow::Result;
use inquire::Select;
use reqwest::Client;
use serde::Deserialize;
use std::str::FromStr;
use strum::{AsRefStr, EnumString};
use std::convert::AsRef;

const TOKEN: &str = include_str!("../token");
const HOST: &str = include_str!("../host");

#[derive(Debug, AsRefStr, PartialEq, EnumString)]
enum MenuOptions {
    #[strum(serialize = "Get all challenges")]
    GetAllChallenges,
    #[strum(serialize = "Approve guides")]
    ApproveGuides
}

#[tokio::main]
async fn main() -> Result<()> {
    // more options to come
    let options = vec![MenuOptions::GetAllChallenges.as_ref(), MenuOptions::ApproveGuides.as_ref()];
    let ans = match Select::new("Menu options", options).prompt() {
        Err(e) => {
            eprintln!("Error: {}. Exiting!", e.to_string());
            exit(1)
        }
        Ok(x) => x,
    };

    let client = Client::new();

    match MenuOptions::from_str(ans)? {
        MenuOptions::ApproveGuides => {
            getUnapprovedChallenges(&client).await?;
        },
        MenuOptions::GetAllChallenges => {
            getChallenges(&client).await?;
        }
    }

    Ok(())
}

async fn getChallenges(client: &Client) -> Result<()> {
    let resp = client
        .get(format!("{HOST}/ctf/challenges"))
        .bearer_auth(TOKEN)
        .send()
        .await?;
    println!("{}", resp.text().await?);
    return Ok(())
}

async fn getUnapprovedChallenges(client: &Client) -> Result<()> {
    let resp = client
        .get(format!("{HOST}/ctf/guides/unapproved"))
        .bearer_auth(TOKEN)
        .send()
        .await?;
    println!("{}", resp.text().await?);
    return Ok(())
}