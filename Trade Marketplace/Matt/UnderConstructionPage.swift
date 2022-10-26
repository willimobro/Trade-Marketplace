//
//  UnderConstructionPage.swift
//  Trade Marketplace
//
//  Created by Matthew Larsen on 18/10/22.
//
//hello
//2
//WHY
import SwiftUI

struct UnderConstructionPage: View {
    var body: some View {
        VStack{
            Image(systemName: "wrench.and.screwdriver")
                .resizable()
                .scaledToFit()
                .foregroundColor(.green)
                .frame(width: 400, height: 200)

            
            Text("Oops.")
                .font(.largeTitle)
            
            Text("This page is Currently in Development. Please check you have the latest version")
                .multilineTextAlignment(.center)
                .padding(.all)
                .foregroundColor(.gray)
        }
    }
}

struct UnderConstructionPage_Previews: PreviewProvider {
    static var previews: some View {
        UnderConstructionPage()
    }
}
