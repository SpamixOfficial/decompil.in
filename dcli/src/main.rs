use std::process::exit;

use anyhow::{anyhow, Result};
use inquire::Select;
use reqwest::{Client, StatusCode};
use serde::Deserialize;
use std::convert::AsRef;
use std::str::FromStr;
use strum::{AsRefStr, EnumString};

const TOKEN: &str = include_str!("../token");
const HOST: &str = include_str!("../host");

#[derive(Debug, AsRefStr, PartialEq, EnumString)]
enum MenuOptions {
    #[strum(serialize = "Get all challenges")]
    GetAllChallenges,
    #[strum(serialize = "Approve guides")]
    ApproveGuides,
}

#[tokio::main]
async fn main() -> Result<()> {
    // Create http(s) client
    let client = Client::new();

    match check_auth(&client).await {
        Ok(_) => (),
        Err(e) => {
            eprintln!("{e}");
            exit(1);
        }
    }

    // more options to come
    // Mutable to allow sub-menus when that is introduced!
    let mut options = vec![
        MenuOptions::GetAllChallenges.as_ref(),
        MenuOptions::ApproveGuides.as_ref(),
    ];

    let ans = match Select::new("Menu options", options).prompt() {
        Err(e) => {
            eprintln!("Error: {}. Exiting!", e.to_string());
            exit(1)
        }
        Ok(x) => x,
    };

    match MenuOptions::from_str(ans)? {
        MenuOptions::ApproveGuides => {
            get_unapproved_guides(&client).await?;
        }
        MenuOptions::GetAllChallenges => {
            get_challenges(&client).await?;
        }
    }

    Ok(())
}

async fn check_auth(client: &Client) -> Result<()> {
    let resp = client
        .get(format!("{HOST}/authenticated"))
        .bearer_auth(TOKEN)
        .send()
        .await?;
    if resp.status() != StatusCode::OK {
        return Err(anyhow!(
            "Authentication token is invalid, recompile with correct token please!",
        ));
    }

    return Ok(());
}

async fn get_challenges(client: &Client) -> Result<()> {
    let resp = client
        .get(format!("{HOST}/ctf/challenges"))
        .bearer_auth(TOKEN)
        .send()
        .await?;
    println!("{}", resp.text().await?);
    return Ok(());
}

async fn get_unapproved_guides(client: &Client) -> Result<()> {
    let resp = client
        .get(format!("{HOST}/ctf/guides/unapproved"))
        .bearer_auth(TOKEN)
        .send()
        .await?;
    println!("{}", resp.text().await?);
    return Ok(());
}

async fn approve_guide(client: &Client, id: usize, guide_id: usize) -> Result<()> {
    let resp = client
        .post(format!(
            "{HOST}/ctf/challenge/{}/guides/{}/approve",
            id, guide_id
        ))
        .bearer_auth(TOKEN)
        .send()
        .await?;
    if resp.status() != 200 {
        return Err(anyhow!(
            "Something went wrong????\n\n{:?}",
            resp.text().await?
        ));
    }
    return Ok(());
}
