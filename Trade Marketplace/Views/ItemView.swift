//
//  ItemView.swift
//  Trade Marketplace
//
//  Created by William larsen on 21/09/22.
//

import SwiftUI

struct ItemView: View {
    @Environment(\.dismiss) var dismiss
    var body: some View {
        VStack{
            // BACKEND scrolling image effect + hello
            Image("money")
                .resizable()
                .ignoresSafeArea()
                .scaledToFit()
                .overlay(
                    Button {
                        dismiss()
                    } label:    {
                        Image(systemName: "chevron.left")
                            .resizable()
                            .frame(width: 19, height: 31)
                            .foregroundColor(.white)
                            .shadow(color: .black, radius: 4, x: 0, y: 0)
                    }   .frame(maxWidth: .infinity, maxHeight:.infinity, alignment: .topLeading)
                        .padding(.horizontal, 30)
                        .padding(.vertical, 30)
                    )
            Spacer()
            ContentItem()
            // text needs to expand content item frame when scrolled
                .offset(y: -30)
        }
        .ignoresSafeArea()
        .navigationBarBackButtonHidden(true)
            .navigationBarTitleDisplayMode(.inline)
               .navigationBarHidden(true)
    }
}

struct ItemView_Previews: PreviewProvider {
    static var previews: some View {
        ItemView()
    }
}
